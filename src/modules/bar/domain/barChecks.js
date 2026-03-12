import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  onSnapshot,
  runTransaction
} from "firebase/firestore";

import { db } from "../../../firebase";

const gymId = "sportzal_demo";

/* =========================
GET OR CREATE OPEN CHECK
========================= */

export async function getOrCreateOpenCheck(clientId, sessionId) {

  const checksRef = collection(db, "gyms", gymId, "barChecks");

  const q = query(
    checksRef,
    where("sessionId", "==", sessionId),
    where("status", "==", "open")
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    return snap.docs[0].id;
  }

  const newCheck = await addDoc(checksRef, {
    clientId,
    sessionId,
    status: "open",
    totalAmount: 0,
    createdAt: serverTimestamp()
  });

  return newCheck.id;
}

/* =========================
ADD ITEM (POS + STOCK SAFE)
========================= */

export async function addItemToCheck(checkId, product) {

  const productRef = doc(
    db,
    "gyms",
    gymId,
    "barProducts",
    product.id
  );

  await runTransaction(db, async (transaction) => {

    const productSnap = await transaction.get(productRef);

    if (!productSnap.exists()) {
      throw new Error("Product not found");
    }

    const stock = productSnap.data().stock || 0;

    if (stock <= 0) {
      throw new Error("Out of stock");
    }

    const itemsRef = collection(
      db,
      "gyms",
      gymId,
      "barChecks",
      checkId,
      "items"
    );

    const q = query(
      itemsRef,
      where("productId", "==", product.id)
    );

    const snap = await getDocs(q);

    const price = Number(product.price) || 0;
    const purchasePrice = Number(product.purchasePrice) || 0;

    if (!snap.empty) {

      const itemDoc = snap.docs[0];

      const itemRef = doc(
        db,
        "gyms",
        gymId,
        "barChecks",
        checkId,
        "items",
        itemDoc.id
      );

      transaction.update(itemRef, {
        qty: increment(1),
        subtotal: increment(price)
      });

    } else {

      const newItemRef = doc(itemsRef);

      transaction.set(newItemRef, {
        productId: product.id,
        name: product.name,
        price: price,
        purchasePrice: purchasePrice,
        qty: 1,
        subtotal: price
      });

    }

    const checkRef = doc(
      db,
      "gyms",
      gymId,
      "barChecks",
      checkId
    );

    transaction.update(checkRef, {
      totalAmount: increment(price)
    });

    transaction.update(productRef, {
      stock: increment(-1)
    });

    /* ===== TOP PRODUCT ANALYTICS ===== */

    const productStatsRef = doc(
      db,
      "gyms",
      gymId,
      "barProductStats",
      product.id
    );

    transaction.set(
      productStatsRef,
      {
        productId: product.id,
        name: product.name,
        soldQty: increment(1)
      },
      { merge: true }
    );

  });

}

/* =========================
REMOVE ITEM (STOCK RETURN)
========================= */

export async function removeItemFromCheck(checkId, item) {

  const itemRef = doc(
    db,
    "gyms",
    gymId,
    "barChecks",
    checkId,
    "items",
    item.id
  );

  const checkRef = doc(
    db,
    "gyms",
    gymId,
    "barChecks",
    checkId
  );

  const productRef = doc(
    db,
    "gyms",
    gymId,
    "barProducts",
    item.productId
  );

  const refundAmount = item.price * item.qty;

  await runTransaction(db, async (transaction) => {

    transaction.delete(itemRef);

    transaction.update(checkRef, {
      totalAmount: increment(-refundAmount)
    });

    transaction.update(productRef, {
      stock: increment(item.qty)
    });

  });

}

/* =========================
VOID CHECK
========================= */

export async function voidCheck(checkId) {

  const itemsRef = collection(
    db,
    "gyms",
    gymId,
    "barChecks",
    checkId,
    "items"
  );

  const itemsSnap = await getDocs(itemsRef);

  await runTransaction(db, async (transaction) => {

    itemsSnap.docs.forEach(docSnap => {

      const item = docSnap.data();

      const productRef = doc(
        db,
        "gyms",
        gymId,
        "barProducts",
        item.productId
      );

      transaction.update(productRef, {
        stock: increment(item.qty)
      });

      transaction.delete(docSnap.ref);

    });

    const checkRef = doc(
      db,
      "gyms",
      gymId,
      "barChecks",
      checkId
    );

    transaction.update(checkRef, {
      status: "void"
    });

  });

}

/* =========================
PAY CHECK + ANALYTICS
========================= */

export async function payCheck(
  checkId,
  amount,
  methods,
  clientId,
  sessionId
) {

  const checkRef = doc(
    db,
    "gyms",
    gymId,
    "barChecks",
    checkId
  );

  await updateDoc(checkRef, {
    status: "paid",
    paidAt: serverTimestamp()
  });

  await addDoc(
    collection(db, "gyms", gymId, "financeTransactions"),
    {
      type: "bar_sale",
      amount,
      methods,
      clientId,
      sessionId,
      checkId,
      createdAt: serverTimestamp()
    }
  );

  /* ===== DAILY ANALYTICS ===== */

  const dateKey = new Date().toISOString().slice(0,10);

  const statsRef = doc(
    db,
    "gyms",
    gymId,
    "barDailyStats",
    dateKey
  );

  await runTransaction(db, async (transaction) => {

    const statsSnap = await transaction.get(statsRef);

    if (!statsSnap.exists()) {

      transaction.set(statsRef, {
        date: dateKey,
        revenue: amount,
        salesCount: 1
      });

    } else {

      transaction.update(statsRef, {
        revenue: increment(amount),
        salesCount: increment(1)
      });

    }

  });

}

/* =========================
REALTIME ITEMS
========================= */

export function subscribeCheckItems(checkId, callback) {

  const itemsRef = collection(
    db,
    "gyms",
    gymId,
    "barChecks",
    checkId,
    "items"
  );

  return onSnapshot(itemsRef, (snap) => {

    const items = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(items);

  });

}

/* =========================
SESSION CLOSE CHECK
========================= */

export async function hasUnpaidCheck(sessionId) {

  const checksRef = collection(
    db,
    "gyms",
    gymId,
    "barChecks"
  );

  const q = query(
    checksRef,
    where("sessionId", "==", sessionId),
    where("status", "==", "open")
  );

  const snap = await getDocs(q);

  return !snap.empty;

}