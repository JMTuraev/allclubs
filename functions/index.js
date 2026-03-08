const { setGlobalOptions } = require("firebase-functions/v2");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();


async function ensureOpenDay(db, gymId) {

  const today = new Date().toISOString().slice(0,10)

  const gymRef = db.doc(`gyms/${gymId}`)
  const daysRef = db.collection(`gyms/${gymId}/days`)
  const todayRef = daysRef.doc(today)

  const todaySnap = await todayRef.get()

  /* ================= TODAY EXISTS ================= */

  if (todaySnap.exists) {

    await gymRef.update({
      currentOpenDayId: today,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })

    return todayRef
  }

  /* ================= CLOSE OLD DAY ================= */

  const openSnap = await daysRef
    .where("status","==","open")
    .limit(1)
    .get()

  if (!openSnap.empty) {

    const oldRef = openSnap.docs[0].ref

    await oldRef.update({
      status: "closed",
      closedAt: admin.firestore.FieldValue.serverTimestamp()
    })

  }

  /* ================= CREATE TODAY ================= */

  await todayRef.set({

    date: today,
    status: "open",
    openedAt: admin.firestore.FieldValue.serverTimestamp(),
    sessionsCount: 0,
    totalMinutes: 0

  })

  /* ================= UPDATE POINTER ================= */

  await gymRef.update({

    currentOpenDayId: today,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()

  })

  return todayRef
}
/* ================= GYM ACCESS HELPER ================= */

async function requireGymUser(tx, gymId, uid) {

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const userSnap = await tx.get(userRef);

console.log("USER PATH:", `gyms/${gymId}/users/${uid}`);
console.log("USER EXISTS:", userSnap.exists);
  if (!userSnap.exists) {
    throw new HttpsError(
      "permission-denied",
      "User not in gym 101"
    );
  }

  const role = userSnap.data().role;

  if (!["owner", "staff"].includes(role)) {
    throw new HttpsError(
      "permission-denied",
      "Invalid role"
    );
  }

  return role;
}

/**
 * Global production-safe settings
 */
setGlobalOptions({
  region: "asia-south1",
  maxInstances: 5,
  timeoutSeconds: 10,
  memory: "256MiB"
});

/**
 * Allowed fields whitelist
 */
const ALLOWED_UPDATE_FIELDS = [
  "visitLimit",
  "remainingVisits",
  "paymentMethod",
  "startDate",
  "endDate",
  "note"
];

exports.updateSubscription = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, subscriptionId, updates } = request.data;
  const uid = request.auth.uid;

  if (!gymId || !subscriptionId || !updates || typeof updates !== "object") {
    throw new HttpsError("invalid-argument", "Invalid parameters");
  }

  const ALLOWED_UPDATE_FIELDS = [
    "visitLimit",
    "remainingVisits",
    "paymentMethod",
    "startDate",
    "endDate",
    "note"
  ];

  const safeUpdates = {};

  for (const key of Object.keys(updates)) {
    if (ALLOWED_UPDATE_FIELDS.includes(key)) {
      safeUpdates[key] = updates[key];
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    throw new HttpsError("invalid-argument", "No valid fields to update");
  }

  const gymRef = db.doc(`gyms/${gymId}`);
  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const subRef = db.doc(`gyms/${gymId}/subscriptions/${subscriptionId}`);
  const transactionsRef = db.collection(`gyms/${gymId}/transactions`);

  return db.runTransaction(async (tx) => {

    /* ========= USER CHECK ========= */

    const gymSnap = await tx.get(gymRef);

    if (!gymSnap.exists) {
      throw new HttpsError("not-found", "Gym not found");
    }

    let role = null;

    if (gymSnap.data().ownerId === uid) {
      role = "owner";
    } else {

      const userSnap = await tx.get(userRef);

      if (!userSnap.exists) {
        throw new HttpsError("permission-denied", "User not in gym");
      }

      role = userSnap.data().role;
    }

    if (!["owner", "staff"].includes(role)) {
      throw new HttpsError("permission-denied", "Invalid role");
    }

    /* ========= SUB CHECK ========= */

    const subSnap = await tx.get(subRef);

    if (!subSnap.exists) {
      throw new HttpsError("not-found", "Subscription not found");
    }

    const sub = subSnap.data();

    if (role === "staff" && (sub.sessionsCount || 0) > 0) {
      throw new HttpsError(
        "failed-precondition",
        "Cannot edit after session started"
      );
    }

    /* ========= DATE VALIDATION ========= */

    if (safeUpdates.startDate && safeUpdates.endDate) {

      const start = new Date(safeUpdates.startDate);
      const end = new Date(safeUpdates.endDate);

      if (start > end) {
        throw new HttpsError(
          "invalid-argument",
          "Start date cannot be after end date"
        );
      }

      safeUpdates.startDate =
        admin.firestore.Timestamp.fromDate(start);

      safeUpdates.endDate =
        admin.firestore.Timestamp.fromDate(end);
    }

    /* ========= PAYMENT METHOD CHANGE (LEDGER SAFE) ========= */

    if (
      safeUpdates.paymentMethod &&
      safeUpdates.paymentMethod !== sub.paymentMethod
    ) {

      const amount =
        Number(sub.price || sub.packageSnapshot?.price || 0);

      // reverse old
      tx.create(transactionsRef.doc(), {
        clientId: sub.clientId,
        subscriptionId,
        amount: -amount,
        paymentMethod: sub.paymentMethod,
        type: "method_change_reverse",
        category: "package",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: uid
      });

      // new method
      tx.create(transactionsRef.doc(), {
        clientId: sub.clientId,
        subscriptionId,
        amount: amount,
        paymentMethod: safeUpdates.paymentMethod,
        type: "method_change_repost",
        category: "package",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: uid
      });
    }

    /* ========= FINAL UPDATE ========= */

    tx.update(subRef, {
      ...safeUpdates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };

  });

});
exports.openDay = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId } = request.data;
  const uid = request.auth.uid;

  if (!gymId) {
    throw new HttpsError("invalid-argument", "Missing gymId");
  }

  const gymRef = db.doc(`gyms/${gymId}`);
  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const daysRef = db.collection(`gyms/${gymId}/days`);
  const statsRef = db.collection(`gyms/${gymId}/dailyStats`);

  return db.runTransaction(async (tx) => {

    const userSnap = await tx.get(userRef);

    if (!userSnap.exists || userSnap.data().role !== "owner") {
      throw new HttpsError("permission-denied", "Only owner can open day");
    }

    const gymSnap = await tx.get(gymRef);

    if (gymSnap.data().currentOpenDayId) {
      throw new HttpsError(
        "failed-precondition",
        "Day already open"
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const dayRef = daysRef.doc(today);
    const statRef = statsRef.doc(today);

    /* DAY */

    tx.set(dayRef, {
      date: today,
      status: "open",
      openedAt: admin.firestore.FieldValue.serverTimestamp(),
      closedAt: null
    });

    /* DAILY STATS */

    tx.set(statRef, {

      sessionsCount: 0,
      totalMinutes: 0,

      barRevenue: 0,
      packageRevenue: 0,

      checkCount: 0,

      payments: {
        cash: 0,
        card: 0,
        transfer: 0
      }

    });

    /* POINTER */

    tx.update(gymRef, {
      currentOpenDayId: today,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };

  });

});

exports.createSubscription = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const {
    gymId,
    clientId,
    packageId,
    startDate,
    amounts
  } = request.data;

  const uid = request.auth.uid;

  if (!gymId || !clientId || !packageId || !amounts) {
    throw new HttpsError("invalid-argument", "Missing parameters");
  }

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const packageRef = db.doc(`gyms/${gymId}/packages/${packageId}`);
  const clientRef = db.doc(`gyms/${gymId}/clients/${clientId}`);
  const subRef = db.collection(`gyms/${gymId}/subscriptions`).doc();
  const txCol = db.collection(`gyms/${gymId}/transactions`);

  return db.runTransaction(async (tx) => {

    /* USER CHECK */

    const userSnap = await tx.get(userRef);

    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not in gym");
    }

    /* CLIENT */

    const clientSnap = await tx.get(clientRef);

    if (!clientSnap.exists) {
      throw new HttpsError("not-found", "Client not found");
    }

    const client = clientSnap.data();

    /* PACKAGE */

    const packageSnap = await tx.get(packageRef);

    if (!packageSnap.exists) {
      throw new HttpsError("not-found", "Package not found");
    }

    const pkg = packageSnap.data();

    const price = Number(pkg.price || 0);

    /* DATE */

    const start = new Date(startDate || new Date());

    const duration =
      Number(pkg.duration || 0) +
      Number(pkg.bonusDays || 0);

    const end = new Date(start);

    end.setDate(end.getDate() + duration - 1);
    end.setHours(23, 59, 59, 999);

    /* CREATE SUBSCRIPTION */

    tx.set(subRef, {

      clientId,
      clientName: `${client.firstName} ${client.lastName}`,
      clientPhone: client.phone,

      packageId,
      packageSnapshot: pkg,
      price,

      startDate: admin.firestore.Timestamp.fromDate(start),
      endDate: admin.firestore.Timestamp.fromDate(end),

      remainingVisits: pkg.visitLimit ?? null,
      visitLimit: pkg.visitLimit ?? null,

      sessionsCount: 0,
      status: "active",

      createdBy: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    /* UPDATE CLIENT POINTER */

    tx.update(clientRef, {
      activeSubscriptionId: subRef.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    /* ============================= */
    /* PAYMENT TRANSACTIONS          */
    /* ============================= */

    const entries = Object.entries(amounts)
      .filter(([_, amount]) => Number(amount) > 0);

    for (const [method, amount] of entries) {

      tx.set(txCol.doc(), {

        type: "service",
        category: "package",

        clientId,

        paymentMethod: method,   // 🔥 METHOD ENDI YOZILADI
        amount: Number(amount),

        source: "subscription",
        sourceId: subRef.id,

        status: "active",

        createdAt: admin.firestore.FieldValue.serverTimestamp()

      });

    }

    return {
      success: true,
      subscriptionId: subRef.id
    };

  });

});

exports.updateSubscriptionStartDate = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, subscriptionId, newStartDate } = request.data;
  const uid = request.auth.uid;

  if (!gymId || !subscriptionId || !newStartDate) {
    throw new HttpsError("invalid-argument", "Missing parameters");
  }

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const subRef = db.doc(`gyms/${gymId}/subscriptions/${subscriptionId}`);
  const subsRef = db.collection(`gyms/${gymId}/subscriptions`);

  return db.runTransaction(async (tx) => {

    const userSnap = await tx.get(userRef);

    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not found");
    }

    const role = userSnap.data().role;

    if (!["owner", "staff"].includes(role)) {
      throw new HttpsError("permission-denied", "Invalid role");
    }

    const subSnap = await tx.get(subRef);

    if (!subSnap.exists) {
      throw new HttpsError("not-found", "Subscription not found");
    }

    const sub = subSnap.data();

    if (sub.sessionOpened === true) {
      throw new HttpsError(
        "failed-precondition",
        "Cannot edit after session started"
      );
    }

    const oldStart = sub.startDate.toDate();
    const oldEnd = sub.endDate.toDate();

    const duration =
      Math.floor((oldEnd - oldStart) / (1000 * 60 * 60 * 24)) + 1;

    const start = new Date(newStartDate);
    const end = new Date(start);

    end.setDate(start.getDate() + duration - 1);
    end.setHours(23, 59, 59, 999);

    const clientSubsSnap = await tx.get(
      subsRef.where("clientId", "==", sub.clientId)
    );

    clientSubsSnap.docs.forEach(doc => {

      if (doc.id === subscriptionId) return;

      const other = doc.data();

      if (["replaced", "cancelled"].includes(other.status))
        return;

      const otherStart = other.startDate.toDate();
      const otherEnd = other.endDate.toDate();

      const overlap =
        start <= otherEnd &&
        end >= otherStart;

      if (overlap) {
        throw new HttpsError(
          "failed-precondition",
          "Subscription dates overlap"
        );
      }

    });

    tx.update(subRef, {
      startDate: admin.firestore.Timestamp.fromDate(start),
      endDate: admin.firestore.Timestamp.fromDate(end),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };

  });

});
exports.startSession = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, clientId, lockerCode } = request.data || {};
  const uid = request.auth.uid;

  if (!gymId || !clientId || !lockerCode) {
    throw new HttpsError("invalid-argument", "Missing parameters");
  }

  const locker = String(lockerCode);

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const clientRef = db.doc(`gyms/${gymId}/clients/${clientId}`);
  const sessionsRef = db.collection(`gyms/${gymId}/sessions`);
  const subsRef = db.collection(`gyms/${gymId}/subscriptions`);

  /* AUTO DAY SYSTEM */

  await ensureOpenDay(db, gymId);

  return db.runTransaction(async (tx) => {

    /* USER CHECK */

    const userSnap = await tx.get(userRef);

    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not in gym");
    }

    const role = userSnap.data().role;

    if (!["owner", "staff"].includes(role)) {
      throw new HttpsError("permission-denied", "Invalid role");
    }

    /* CLIENT */

    const clientSnap = await tx.get(clientRef);

    if (!clientSnap.exists) {
      throw new HttpsError("not-found", "Client not found");
    }

    const client = clientSnap.data();

    /* ACTIVE SESSION CHECK */

    if (client.activeSessionId) {
      throw new HttpsError(
        "already-exists",
        "Client already in gym"
      );
    }

    /* SUBSCRIPTION */

    if (!client.activeSubscriptionId) {
      throw new HttpsError(
        "failed-precondition",
        "No active subscription"
      );
    }

    const subRef = subsRef.doc(client.activeSubscriptionId);
    const subSnap = await tx.get(subRef);

    if (!subSnap.exists) {
      throw new HttpsError(
        "failed-precondition",
        "Subscription not found"
      );
    }

    const sub = subSnap.data();

    /* VISIT LIMIT */

    if (
      sub.visitLimit != null &&
      sub.remainingVisits <= 0
    ) {
      throw new HttpsError(
        "failed-precondition",
        "No remaining visits"
      );
    }

    /* CREATE SESSION */

    const sessionRef = sessionsRef.doc();

    tx.set(sessionRef, {

  clientId,
  clientName: `${client.firstName} ${client.lastName}`, // POS uchun tez lookup

  subscriptionId: client.activeSubscriptionId,

  locker: locker, // 🔥 lockerCode o‘rniga

  startedAt: admin.firestore.FieldValue.serverTimestamp(),
  endedAt: null,

  status: "active",

  totalAmount: 0,
  transactions: [],

  createdBy: uid,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()

});

    /* UPDATE CLIENT POINTER */

    tx.update(clientRef, {
      activeSessionId: sessionRef.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    /* UPDATE SUBSCRIPTION */

    const updateData = {
      sessionsCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (sub.visitLimit != null) {
      updateData.remainingVisits =
        admin.firestore.FieldValue.increment(-1);
    }

    tx.update(subRef, updateData);

    return { success: true };

  });

});


exports.endSession = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, sessionId } = request.data;
  const uid = request.auth.uid;

  if (!gymId || !sessionId) {
    throw new HttpsError("invalid-argument", "Missing parameters");
  }

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const sessionRef = db.doc(`gyms/${gymId}/sessions/${sessionId}`);
  const gymRef = db.doc(`gyms/${gymId}`);

  /* ================= AUTO DAY ================= */

  await ensureOpenDay(db, gymId);

  return db.runTransaction(async (tx) => {

    /* ================= USER ================= */

    const userSnap = await tx.get(userRef);

    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not in gym");
    }

    const role = userSnap.data().role;

    if (!["owner", "staff"].includes(role)) {
      throw new HttpsError("permission-denied", "Invalid role");
    }

    /* ================= SESSION ================= */

    const sessionSnap = await tx.get(sessionRef);

    if (!sessionSnap.exists) {
      throw new HttpsError("not-found", "Session not found");
    }

    const session = sessionSnap.data();

    if (session.status !== "active") {
      throw new HttpsError(
        "failed-precondition",
        "Session already closed"
      );
    }

    if (!session.startedAt) {
      throw new HttpsError(
        "failed-precondition",
        "Invalid session start time"
      );
    }

    const clientId = session.clientId;
    const clientRef = db.doc(`gyms/${gymId}/clients/${clientId}`);

    /* ================= GYM ================= */

    const gymSnap = await tx.get(gymRef);

    if (!gymSnap.exists) {
      throw new HttpsError("not-found", "Gym not found");
    }

    const currentDayId = gymSnap.data().currentOpenDayId;

    if (!currentDayId) {
      throw new HttpsError(
        "failed-precondition",
        "No open day"
      );
    }

    const dayRef = db.doc(`gyms/${gymId}/days/${currentDayId}`);
    const statsRef = db.doc(`gyms/${gymId}/dailyStats/${currentDayId}`);

    /* ================= TIME ================= */

    const nowTs = admin.firestore.Timestamp.now();

    const startedAt = session.startedAt.toDate();
    const endedAt = nowTs.toDate();

    const durationMinutes = Math.max(
      1,
      Math.floor((endedAt - startedAt) / 60000)
    );

    /* ================= CLOSE SESSION ================= */

    tx.update(sessionRef, {
      status: "closed",
      endedAt: nowTs,
      durationMinutes,
      updatedAt: nowTs
    });

    /* ================= RESET CLIENT ================= */

    tx.update(clientRef, {
      activeSessionId: null,
      updatedAt: nowTs
    });

    /* ================= UPDATE DAY ================= */

    tx.set(dayRef, {
      sessionsCount: admin.firestore.FieldValue.increment(1),
      totalMinutes: admin.firestore.FieldValue.increment(durationMinutes),
      updatedAt: nowTs
    }, { merge: true });

    /* ================= UPDATE DAILY STATS ================= */

    tx.set(statsRef, {
      sessionsCount: admin.firestore.FieldValue.increment(1),
      totalMinutes: admin.firestore.FieldValue.increment(durationMinutes),
      updatedAt: nowTs
    }, { merge: true });

    return { success: true };

  });

});

exports.createClient = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, firstName, lastName, phone, gender, note, image } = request.data;
  const uid = request.auth.uid;

  if (!gymId || !firstName || !lastName || !phone) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const clientsRef = db.collection(`gyms/${gymId}/clients`);

  /* ================= ROLE CHECK ================= */

  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new HttpsError("permission-denied", "User not in gym 107");
  }

  const role = userSnap.data().role;

  if (!["owner", "staff"].includes(role)) {
    throw new HttpsError("permission-denied", "Insufficient role");
  }

  /* ================= CREATE CLIENT ================= */

  const clientRef = clientsRef.doc();

  await clientRef.set({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phone: phone.trim(),
    gender: gender || "male",
    note: note || "",
    image: image || null,

    lifetimeSpent: 0,
    isArchived: false,

    createdBy: uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    clientId: clientRef.id,
  };
});

  exports.replaceSubscription = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, oldSubscriptionId, newPlan } = request.data;
  const uid = request.auth.uid;

  if (!gymId || !oldSubscriptionId || !newPlan) {
    throw new HttpsError("invalid-argument", "Missing parameters");
  }

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const oldSubRef = db.doc(`gyms/${gymId}/subscriptions/${oldSubscriptionId}`);
  const subsRef = db.collection(`gyms/${gymId}/subscriptions`);
  const transactionsRef = db.collection(`gyms/${gymId}/transactions`);

  return db.runTransaction(async (tx) => {

    /* ========= USER CHECK ========= */

    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not found");
    }

    const role = userSnap.data().role;
    if (!["owner", "staff"].includes(role)) {
      throw new HttpsError("permission-denied", "Invalid role");
    }

    /* ========= OLD SUB CHECK ========= */

    const oldSubSnap = await tx.get(oldSubRef);
    if (!oldSubSnap.exists) {
      throw new HttpsError("not-found", "Old subscription not found");
    }

    const oldSub = oldSubSnap.data();

    if (oldSub.status !== "active") {
      throw new HttpsError("failed-precondition", "Subscription not active");
    }

    const oldPrice = Number(oldSub.price || 0);
    const newPrice = Number(newPlan.price || 0);

    /* ========= 1️⃣ MARK OLD AS REPLACED ========= */

    tx.update(oldSubRef, {
      status: "replaced",
      replacedAt: admin.firestore.FieldValue.serverTimestamp(),
      replacedBy: uid
    });

    /* ========= 2️⃣ CREATE NEW SUB ========= */

    const newSubRef = subsRef.doc();

    tx.create(newSubRef, {
      ...newPlan,
      clientId: oldSub.clientId,
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: uid,
      replacedFrom: oldSubscriptionId
    });

    /* ========= 3️⃣ LEDGER ENTRIES ========= */

    // Reverse old amount
    tx.create(transactionsRef.doc(), {
      gymId,
      clientId: oldSub.clientId,
      subscriptionId: oldSubscriptionId,
      amount: -oldPrice,
      method: oldSub.paymentMethod,
      type: "package_reverse",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: uid
    });

    // New sale
    tx.create(transactionsRef.doc(), {
      gymId,
      clientId: oldSub.clientId,
      subscriptionId: newSubRef.id,
      amount: newPrice,
      method: newPlan.paymentMethod,
      type: "package_sale",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: uid
    });

    return { success: true };
  });
});

exports.getOrCreateOpenBarCheck = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, sessionId, clientId } = request.data;

  if (!gymId || !sessionId || !clientId) {
    throw new HttpsError("invalid-argument", "Missing params");
  }

  const checksRef = db.collection(`gyms/${gymId}/barChecks`);
  const sessionRef = db.doc(`gyms/${gymId}/sessions/${sessionId}`);

  return db.runTransaction(async (tx) => {

    /* 1️⃣ SESSION VALIDATION */

    const sessionSnap = await tx.get(sessionRef);

    if (!sessionSnap.exists) {
      throw new HttpsError("not-found", "Session not found");
    }

    if (sessionSnap.data().status !== "active") {
      throw new HttpsError("failed-precondition", "Session not active");
    }

    /* 2️⃣ EXISTING OPEN CHECK SEARCH */

    const openCheckSnap = await tx.get(
      checksRef
        .where("sessionId", "==", sessionId)
        .where("status", "==", "open")
        .limit(1)
    );

    if (!openCheckSnap.empty) {
      return {
        checkId: openCheckSnap.docs[0].id,
        created: false
      };
    }

    /* 3️⃣ CREATE NEW OPEN CHECK */

    const newCheckRef = checksRef.doc();

    tx.set(newCheckRef, {
      sessionId,
      clientId,
      status: "open",
      total: 0,
      paidAmount: 0,
      debtAmount: 0,
      items: [],
      payments: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      checkId: newCheckRef.id,
      created: true
    };
  });
});
exports.addItemToBarCheck = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const {
    gymId,
    checkId,
    productId,
    name,
    price,
    quantity
  } = request.data;

  if (!gymId || !checkId || !productId || !price || !quantity) {
    throw new HttpsError("invalid-argument", "Missing params");
  }

  const checkRef = db.doc(`gyms/${gymId}/barChecks/${checkId}`);
  const productRef = db.doc(`gyms/${gymId}/barProducts/${productId}`);

  const itemRef = db.collection(
    `gyms/${gymId}/barChecks/${checkId}/items`
  ).doc(productId);

  return db.runTransaction(async (tx) => {

    const checkSnap = await tx.get(checkRef);

    if (!checkSnap.exists) {
      throw new HttpsError("not-found", "Check not found");
    }

    const check = checkSnap.data();

    if (check.status !== "open") {
      throw new HttpsError("failed-precondition", "Check closed");
    }

    const itemSnap = await tx.get(itemRef);

    if (itemSnap.exists) {

      tx.update(itemRef, {
        qty: admin.firestore.FieldValue.increment(quantity),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    } else {

      tx.set(itemRef, {
        productId,
        name,
        price,
        qty: quantity,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    }

    tx.update(checkRef, {
      total: admin.firestore.FieldValue.increment(price * quantity),
      debtAmount: admin.firestore.FieldValue.increment(price * quantity),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    tx.update(productRef, {
      stock: admin.firestore.FieldValue.increment(-quantity),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };

  });

});
exports.decreaseItemFromBarCheck = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, checkId, productId } = request.data;

  if (!gymId || !checkId || !productId) {
    throw new HttpsError("invalid-argument", "Missing params");
  }

  const checkRef = db.doc(`gyms/${gymId}/barChecks/${checkId}`);
  const productRef = db.doc(`gyms/${gymId}/barProducts/${productId}`);

  return db.runTransaction(async (tx) => {

    const checkSnap = await tx.get(checkRef);
    if (!checkSnap.exists) {
      throw new HttpsError("not-found", "Check not found");
    }

    const check = checkSnap.data();

    if (check.status !== "open") {
      throw new HttpsError("failed-precondition", "Check closed");
    }

    const item = check.items.find(i => i.productId === productId);
    if (!item) {
      throw new HttpsError("not-found", "Item not found");
    }

    // 1️⃣ Stockni qaytaramiz
    tx.update(productRef, {
      stock: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 2️⃣ Qty kamaytirish yoki o‘chirish
    let newItems;

    if (item.qty === 1) {
      newItems = check.items.filter(i => i.productId !== productId);
    } else {
      newItems = check.items.map(i =>
        i.productId === productId
          ? { ...i, qty: i.qty - 1 }
          : i
      );
    }

    const newTotal = newItems.reduce(
      (sum, i) => sum + i.qty * i.price,
      0
    );

    tx.update(checkRef, {
      items: newItems,
      total: newTotal,
      debtAmount: newTotal - (check.paidAmount || 0),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  });
});

exports.createBarCategory = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, name } = request.data;

  if (!gymId || !name) {
    throw new HttpsError("invalid-argument", "Missing params");
  }

  const ref = db.collection(`gyms/${gymId}/barCategories`).doc();

  await ref.set({
    name,
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { id: ref.id };
});

exports.updateBarCategory = onCall(async (request) => {

  const { gymId, categoryId, name } = request.data;

  const ref = db.doc(`gyms/${gymId}/barCategories/${categoryId}`);

  await ref.update({
    name,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});

exports.deleteBarCategory = onCall(async (request) => {

  const { gymId, categoryId } = request.data;

  const products = await db
    .collection(`gyms/${gymId}/barProducts`)
    .where("categoryId", "==", categoryId)
    .limit(1)
    .get();

  if (!products.empty) {
    throw new HttpsError(
      "failed-precondition",
      "Category has products"
    );
  }

  const ref = db.doc(`gyms/${gymId}/barCategories/${categoryId}`);

  await ref.update({
    isActive: false,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true };
});



/* ================= CREATE PRODUCT ================= */

exports.createBarProduct = onCall(async (request) => {

  /* ================= AUTH CHECK ================= */

  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Login required"
    );
  }

  /* ================= INPUT ================= */

  const { gymId, data } = request.data || {};

  if (!gymId) {
    throw new HttpsError(
      "invalid-argument",
      "gymId required"
    );
  }

  if (!data?.name) {
    throw new HttpsError(
      "invalid-argument",
      "Product name required"
    );
  }

  if (!data?.categoryId) {
    throw new HttpsError(
      "invalid-argument",
      "categoryId required"
    );
  }

  /* ================= CREATE PRODUCT ================= */

  const ref = db
    .collection(`gyms/${gymId}/barProducts`)
    .doc();

  await ref.set({
    name: data.name,
    categoryId: data.categoryId,
    price: Number(data.price) || 0,
    image: data.image || "",
    stock: 0,
    purchasePrice: 0,
    isActive: true,

    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  /* ================= RETURN ================= */

  return {
    id: ref.id
  };

});
/* ================= UPDATE PRODUCT ================= */

exports.updateBarProduct = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const data = request.data;

  if (!data) {
    throw new HttpsError("invalid-argument", "No data provided");
  }

  const { gymId, productId, updates } = data;

  if (!gymId || !productId) {
    throw new HttpsError("invalid-argument", "Missing params");
  }

  const ref = db.doc(`gyms/${gymId}/barProducts/${productId}`);

  await ref.update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true
  };

});

/* ================= DELETE PRODUCT (SOFT DELETE) ================= */

exports.deleteBarProduct = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const data = request.data;

  if (!data) {
    throw new HttpsError("invalid-argument", "No data provided");
  }

  const { gymId, productId } = data;

  if (!gymId || !productId) {
    throw new HttpsError("invalid-argument", "Missing params");
  }

  const ref = db.doc(`gyms/${gymId}/barProducts/${productId}`);

  await ref.update({
    isActive: false,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    success: true
  };

});


exports.createBarIncoming = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, items } = request.data;

  if (!gymId) {
    throw new HttpsError("invalid-argument", "gymId required");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new HttpsError("invalid-argument", "items required");
  }

  const incomingRef =
    db.collection(`gyms/${gymId}/barIncoming`).doc();

  let total = 0;

  const itemsToSave = [];

  await db.runTransaction(async (tx) => {

    for (const item of items) {

      const {
        productId,
        quantity,
        purchasePrice
      } = item;

      const productRef = db.doc(
        `gyms/${gymId}/barProducts/${productId}`
      );

      const productSnap = await tx.get(productRef);

      if (!productSnap.exists) {
        throw new HttpsError(
          "not-found",
          "product not found"
        );
      }

      const product = productSnap.data();

      total += quantity * purchasePrice;

      /* STOCK UPDATE */

      tx.update(productRef, {
        stock: (product.stock || 0) + quantity,
        purchasePrice,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      /* 🔥 PRODUCT SNAPSHOT SAVE */

      itemsToSave.push({
        productId,
        name: product.name,
        quantity,
        purchasePrice
      });

    }

    tx.set(incomingRef, {
      invoiceNumber:
        "INC-" + Date.now().toString().slice(-6),
      items: itemsToSave,
      total,
      createdAt:
        admin.firestore.FieldValue.serverTimestamp()
    });

  });

  return { id: incomingRef.id };

});


exports.deleteBarIncoming = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, incomingId } = request.data;

  if (!gymId || !incomingId) {
    throw new HttpsError("invalid-argument", "missing params");
  }

  const incomingRef = db.doc(`gyms/${gymId}/barIncoming/${incomingId}`);

  await db.runTransaction(async (tx) => {

    const incomingSnap = await tx.get(incomingRef);

    if (!incomingSnap.exists) {
      throw new HttpsError("not-found", "invoice not found");
    }

    const incoming = incomingSnap.data();

    for (const item of incoming.items) {

      const productRef = db.doc(
        `gyms/${gymId}/barProducts/${item.productId}`
      );

      const productSnap = await tx.get(productRef);

      if (!productSnap.exists) continue;

      const product = productSnap.data();

      tx.update(productRef, {
        stock: (product.stock || 0) - item.quantity,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }); 

    }

    tx.delete(incomingRef);

  });

  return { success: true };

});

exports.addItemToCheckFast = onCall(async (request) => {

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, sessionId, clientId, productId } = request.data;

  if (!gymId || !sessionId || !clientId || !productId) {
    throw new HttpsError("invalid-argument", "Missing params");
  }

  const checksRef = db.collection(`gyms/${gymId}/barChecks`);
  const productRef = db.doc(`gyms/${gymId}/barProducts/${productId}`);
  const inventoryRef = db.doc(`gyms/${gymId}/barInventory/${productId}`);

  return db.runTransaction(async (tx) => {

    /* ================= PRODUCT ================= */

    const productSnap = await tx.get(productRef);

    if (!productSnap.exists) {
      throw new HttpsError("not-found", "Product not found");
    }

    const product = productSnap.data();

    /* ================= INVENTORY ================= */

    const inventorySnap = await tx.get(inventoryRef);

    if (!inventorySnap.exists) {
      throw new HttpsError("failed-precondition", "Inventory missing");
    }

    const stock = inventorySnap.data().stock || 0;

    if (stock <= 0) {
      throw new HttpsError("failed-precondition", "Out of stock");
    }

    /* ================= FIND CHECK ================= */

    const checkQuery = await tx.get(
      checksRef
        .where("sessionId", "==", sessionId)
        .where("status", "==", "open")
        .limit(1)
    );

    let checkRef;
    let check;

    if (checkQuery.empty) {

      checkRef = checksRef.doc();

      check = {
        sessionId,
        clientId,
        status: "open",
        total: 0,
        paidAmount: 0,
        debtAmount: 0,
        items: [],
        payments: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      tx.set(checkRef, check);

    } else {

      const doc = checkQuery.docs[0];
      checkRef = doc.ref;
      check = doc.data();

    }

    /* ================= UPDATE ITEMS ================= */

    const existing = check.items.find(
      (i) => i.productId === productId
    );

    let newItems;

    if (existing) {

      newItems = check.items.map((i) =>
        i.productId === productId
          ? { ...i, qty: i.qty + 1 }
          : i
      );

    } else {

      newItems = [
        ...check.items,
        {
          productId,
          name: product.name,
          qty: 1,
          price: product.price
        }
      ];

    }

    const newTotal = newItems.reduce(
      (sum, i) => sum + i.qty * i.price,
      0
    );

    /* ================= UPDATE INVENTORY ================= */

    tx.update(inventoryRef, {
      stock: admin.firestore.FieldValue.increment(-1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    /* ================= UPDATE CHECK ================= */

    tx.update(checkRef, {
      items: newItems,
      total: newTotal,
      debtAmount: newTotal - (check.paidAmount || 0),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, checkId: checkRef.id };

  });

});