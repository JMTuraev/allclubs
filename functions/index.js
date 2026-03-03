const { setGlobalOptions } = require("firebase-functions/v2");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

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

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const subRef = db.doc(`gyms/${gymId}/subscriptions/${subscriptionId}`);
  const transactionsRef = db.collection(`gyms/${gymId}/transactions`);

  return db.runTransaction(async (tx) => {

    /* ========= USER CHECK ========= */

    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not in gym");
    }

    const role = userSnap.data().role;
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
    }

    /* ========= PAYMENT METHOD CHANGE (LEDGER SAFE) ========= */

    if (
      safeUpdates.paymentMethod &&
      safeUpdates.paymentMethod !== sub.paymentMethod
    ) {
      const amount = Number(sub.price || 0);

      // 1️⃣ Reverse old transaction
      tx.create(transactionsRef.doc(), {
        gymId,
        clientId: sub.clientId,
        subscriptionId,
        amount: -amount,
        method: sub.paymentMethod,
        type: "method_change_reverse",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: uid
      });

      // 2️⃣ Create new transaction with new method
      tx.create(transactionsRef.doc(), {
        gymId,
        clientId: sub.clientId,
        subscriptionId,
        amount: amount,
        method: safeUpdates.paymentMethod,
        type: "method_change_repost",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: uid
      });
    }

    /* ========= FINAL SUB UPDATE ========= */

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

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const daysRef = db.collection(`gyms/${gymId}/days`);

  return db.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists || userSnap.data().role !== "owner") {
      throw new HttpsError("permission-denied", "Only owner can open day");
    }

    const openQuery = daysRef.where("status", "==", "open").limit(1);
    const openSnap = await tx.get(openQuery);

    if (!openSnap.empty) {
      throw new HttpsError("failed-precondition", "Day already open");
    }

    const today = new Date().toISOString().split("T")[0];
    const dayRef = daysRef.doc(today);

    tx.set(dayRef, {
      date: today,
      status: "open",
      openedAt: admin.firestore.FieldValue.serverTimestamp(),
      closedAt: null,
      totals: {
        serviceRevenue: 0,
        paymentRevenue: 0,
        paymentMethods: {}
      }
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
    amounts,
    comment,
    replaceId
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
  const daysRef = db.collection(`gyms/${gymId}/days`);

  /* ================= PRELOAD OLD TRANSACTIONS (OUTSIDE TX) ================= */

  let oldTransactions = [];

  if (replaceId) {
    const snap = await txCol
      .where("sourceId", "==", replaceId)
      .get();

    oldTransactions = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }

  return db.runTransaction(async (tx) => {

    /* USER */
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not in gym");
    }

    /* ACTIVE DAY */
    const openSnap = await tx.get(
      daysRef.where("status", "==", "open").limit(1)
    );

    if (openSnap.empty) {
      throw new HttpsError("failed-precondition", "No active day open");
    }

    const dayDoc = openSnap.docs[0];
    const dayRef = dayDoc.ref;
    const totals = dayDoc.data().totals || {};

    let serviceRevenue = totals.serviceRevenue || 0;
    let paymentRevenue = totals.paymentRevenue || 0;
    let paymentMethods = { ...(totals.paymentMethods || {}) };

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

    const paid = Object.values(amounts)
      .reduce((sum, v) => sum + Number(v || 0), 0);

    if (Math.abs(paid - price) > 0.01) {
      throw new HttpsError("invalid-argument", "Payment mismatch");
    }

    const start = new Date(startDate || new Date());
    const duration = Number(pkg.duration || 0) + Number(pkg.bonusDays || 0);
    const end = new Date(start);
    end.setDate(end.getDate() + duration - 1);
    end.setHours(23, 59, 59, 999);

    /* ================= REPLACE SAFE ================= */

    if (replaceId) {

      const oldSubRef = db.doc(
        `gyms/${gymId}/subscriptions/${replaceId}`
      );

      const oldSubSnap = await tx.get(oldSubRef);
      if (!oldSubSnap.exists) {
        throw new HttpsError("not-found", "Old subscription not found");
      }

      tx.update(oldSubRef, {
        status: "replaced",
        replaceComment: comment || null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      for (const oldTx of oldTransactions) {

        const oldTxRef = txCol.doc(oldTx.id);

        tx.update(oldTxRef, {
          status: "replaced",
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        tx.set(txCol.doc(), {
          type: oldTx.type,
          category: oldTx.category || null,
          clientId: oldTx.clientId,
          paymentMethod: oldTx.paymentMethod || null,
          amount: -Math.abs(Number(oldTx.amount || 0)),
          source: oldTx.source,
          sourceId: replaceId,
          status: "active",
          meta: {
            reversal: true,
            reversedTransactionId: oldTx.id
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        if (oldTx.type === "service") {
          serviceRevenue -= Number(oldTx.amount || 0);
        }

        if (oldTx.type === "payment") {
          paymentRevenue -= Number(oldTx.amount || 0);

          if (oldTx.paymentMethod) {
            paymentMethods[oldTx.paymentMethod] =
              (paymentMethods[oldTx.paymentMethod] || 0) -
              Number(oldTx.amount || 0);
          }
        }
      }
    }

    /* ================= CREATE NEW ================= */

    tx.set(subRef, {
      clientId,
      clientName: `${client.firstName} ${client.lastName}`,
      clientPhone: client.phone,
      packageId,
      packageSnapshot: pkg,
      price,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      remainingVisits: pkg.visitLimit ?? null,
      visitLimit: pkg.visitLimit ?? null,
      sessionsCount: 0,
      status: "scheduled",
      createdBy: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    tx.set(txCol.doc(), {
      type: "service",
      category: "package",
      clientId,
      amount: price,
      source: "subscription",
      sourceId: subRef.id,
      status: "active",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    serviceRevenue += price;

    for (const [method, amount] of Object.entries(amounts)) {
      if (Number(amount) > 0) {

        tx.set(txCol.doc(), {
          type: "payment",
          category: "package",
          clientId,
          paymentMethod: method,
          amount: Number(amount),
          source: "subscription",
          sourceId: subRef.id,
          status: "active",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        paymentRevenue += Number(amount);
        paymentMethods[method] =
          (paymentMethods[method] || 0) + Number(amount);
      }
    }

    tx.update(dayRef, {
      "totals.serviceRevenue": serviceRevenue,
      "totals.paymentRevenue": paymentRevenue,
      "totals.paymentMethods": paymentMethods,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, subscriptionId: subRef.id };
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

    // 1️⃣ Role check
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not found");
    }

    const role = userSnap.data().role;

    if (!["owner", "staff"].includes(role)) {
      throw new HttpsError("permission-denied", "Invalid role");
    }

    // 2️⃣ Subscription read
    const subSnap = await tx.get(subRef);
    if (!subSnap.exists) {
      throw new HttpsError("not-found", "Subscription not found");
    }

    const sub = subSnap.data();

    // 🔒 Session opened check
    if (sub.sessionOpened === true) {
      throw new HttpsError(
        "failed-precondition",
        "Cannot edit after session started"
      );
    }

    const oldStart = new Date(sub.startDate);
    const oldEnd = new Date(sub.endDate);

    const duration =
      Math.floor(
        (oldEnd - oldStart) / (1000 * 60 * 60 * 24)
      ) + 1;

    const start = new Date(newStartDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration - 1);
    end.setHours(23, 59, 59, 999);

    if (start > end) {
      throw new HttpsError(
        "invalid-argument",
        "Invalid date range"
      );
    }

    // 3️⃣ Overlap check (minimal read)
    const clientSubsSnap = await tx.get(
      subsRef.where("clientId", "==", sub.clientId)
    );

    clientSubsSnap.docs.forEach(doc => {
      if (doc.id === subscriptionId) return;

      const other = doc.data();

      if (["replaced", "cancelled"].includes(other.status))
        return;

      const otherStart = new Date(other.startDate);
      const otherEnd = new Date(other.endDate);

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

    // 4️⃣ Update
    tx.update(subRef, {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  });
});

exports.startSession = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const { gymId, clientId, lockerCode } = request.data;
  const uid = request.auth.uid;

  if (!gymId || !clientId || !lockerCode) {
    throw new HttpsError("invalid-argument", "Missing parameters");
  }

  const userRef = db.doc(`gyms/${gymId}/users/${uid}`);
  const subsRef = db.collection(`gyms/${gymId}/subscriptions`);
  const sessionsRef = db.collection(`gyms/${gymId}/sessions`);
  const daysRef = db.collection(`gyms/${gymId}/days`);

  return db.runTransaction(async (tx) => {

    /* ================= 1️⃣ USER CHECK ================= */

    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not in gym");
    }

    const userData = userSnap.data();
    if (!["owner", "staff"].includes(userData.role)) {
      throw new HttpsError("permission-denied", "Insufficient role");
    }

    /* ================= 2️⃣ DAY OPEN CHECK ================= */

    const openDaySnap = await tx.get(
      daysRef.where("status", "==", "open").limit(1)
    );

    if (openDaySnap.empty) {
      throw new HttpsError(
        "failed-precondition",
        "Day is closed"
      );
    }

    /* ================= 3️⃣ ACTIVE SUBSCRIPTION CHECK ================= */

    const subsSnap = await tx.get(
      subsRef.where("clientId", "==", clientId)
    );

    const now = admin.firestore.Timestamp.now().toDate();

    let activeSubDoc = null;

    subsSnap.docs.forEach(doc => {
      const sub = doc.data();

      if (!sub.startDate || !sub.endDate) return;

      const start = new Date(sub.startDate);
      const end = new Date(sub.endDate);

      const withinDateRange =
        now >= start && now <= end;

      const notCancelled =
        sub.status !== "cancelled" &&
        sub.status !== "replaced";

      if (withinDateRange && notCancelled) {
        activeSubDoc = { id: doc.id, ...sub };
      }
    });

    if (!activeSubDoc) {
      throw new HttpsError(
        "failed-precondition",
        "No active subscription"
      );
    }

    /* ================= 4️⃣ VISIT LIMIT CHECK ================= */

    if (
      activeSubDoc.visitLimit !== null &&
      activeSubDoc.remainingVisits <= 0
    ) {
      throw new HttpsError(
        "failed-precondition",
        "No remaining visits"
      );
    }

    /* ================= 5️⃣ ACTIVE SESSION PROTECTION ================= */

    const activeSessionSnap = await tx.get(
      sessionsRef
        .where("clientId", "==", clientId)
        .where("status", "==", "active")
        .limit(1)
    );

    if (!activeSessionSnap.empty) {
      throw new HttpsError(
        "already-exists",
        "Client already has active session"
      );
    }

    /* ================= 6️⃣ LOCKER PROTECTION ================= */

    const lockerSnap = await tx.get(
      sessionsRef
        .where("lockerCode", "==", lockerCode)
        .where("status", "==", "active")
        .limit(1)
    );

    if (!lockerSnap.empty) {
      throw new HttpsError(
        "already-exists",
        "Locker already in use"
      );
    }

    /* ================= 7️⃣ UPDATE SUBSCRIPTION ================= */

    const subRef = subsRef.doc(activeSubDoc.id);

    const subUpdate = {
      sessionsCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (activeSubDoc.visitLimit !== null) {
      subUpdate.remainingVisits =
        admin.firestore.FieldValue.increment(-1);
    }

    tx.update(subRef, subUpdate);

    /* ================= 8️⃣ CREATE SESSION ================= */

    const sessionRef = sessionsRef.doc();

    tx.set(sessionRef, {
      clientId,
      subscriptionId: activeSubDoc.id,
      lockerCode,

      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      endedAt: null,

      status: "active",
      totalAmount: 0,
      transactions: [],

      createdBy: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

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
  const daysRef = db.collection(`gyms/${gymId}/days`);

  return db.runTransaction(async (tx) => {

    /* ================= 1️⃣ USER + ROLE CHECK ================= */

    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) {
      throw new HttpsError("permission-denied", "User not in gym");
    }

    const userData = userSnap.data();
    if (!["owner", "staff"].includes(userData.role)) {
      throw new HttpsError("permission-denied", "Insufficient role");
    }

    /* ================= 2️⃣ SESSION CHECK ================= */

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

    /* ================= 3️⃣ OPEN DAY CHECK ================= */

    const openDaySnap = await tx.get(
      daysRef.where("status", "==", "open").limit(1)
    );

    if (openDaySnap.empty) {
      throw new HttpsError(
        "failed-precondition",
        "No open day found"
      );
    }

    const dayDoc = openDaySnap.docs[0];
    const dayRef = dayDoc.ref;

    /* ================= 4️⃣ DURATION CALC ================= */

    const nowTs = admin.firestore.Timestamp.now();
    const startedAt = session.startedAt.toDate();
    const endedAt = nowTs.toDate();

    const durationMinutes = Math.max(
      1,
      Math.floor((endedAt - startedAt) / 60000)
    );

    /* ================= 5️⃣ UPDATE SESSION ================= */

    tx.update(sessionRef, {
      status: "closed",
      endedAt: nowTs,
      durationMinutes,
      updatedAt: nowTs
    });

    /* ================= 6️⃣ UPDATE DAILY STATS (ATOMIC) ================= */

    tx.update(dayRef, {
      sessionsCount: admin.firestore.FieldValue.increment(1),
      totalMinutes: admin.firestore.FieldValue.increment(durationMinutes),
      updatedAt: nowTs
    });

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
    throw new HttpsError("permission-denied", "User not in gym");
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