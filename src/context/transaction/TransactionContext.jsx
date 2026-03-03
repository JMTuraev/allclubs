import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore"

import { db } from "../../firebase"

const TransactionContext = createContext()

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const gymId = "sportzal_demo"

  /* ================= REALTIME ================= */

  useEffect(() => {
    const q = query(
      collection(db, "gyms", gymId, "transactions"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      setTransactions(list)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [gymId])

  /* ================= REPLACE (LEDGER SAFE) ================= */

  const replacePayment = async (oldTx, amounts) => {

    // 1️⃣ Eski transactionni replaced qilamiz
    const oldRef = doc(db, "gyms", gymId, "transactions", oldTx.id)

    await updateDoc(oldRef, {
      status: "replaced",
      updatedAt: serverTimestamp(),
    })

    // 2️⃣ MUHIM: minus reversal yozamiz
    await addDoc(collection(db, "gyms", gymId, "transactions"), {
      type: "payment",
      clientId: String(oldTx.clientId),
      paymentMethod: oldTx.paymentMethod,
      amount: -Math.abs(Number(oldTx.amount)), // 🔥 HAR DOIM MINUS
      status: "active",
      meta: {
        replaceRefund: true,
        originalTxId: oldTx.id,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // 3️⃣ Yangi paymentlar
    const entries = Object.entries(amounts).filter(
      ([_, amount]) => Number(amount) > 0
    )

    for (const [method, amount] of entries) {
      await addDoc(collection(db, "gyms", gymId, "transactions"), {
        type: "payment",
        clientId: String(oldTx.clientId),
        paymentMethod: method,
        amount: Number(amount),
        status: "active",
        meta: {
          replacedOriginal: oldTx.id,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
  }

  const activeTransactions = useMemo(
    () => transactions.filter((t) => t.status !== "cancelled"),
    [transactions]
  )

  const value = useMemo(
    () => ({
      transactions,
      activeTransactions,
      loading,
      replacePayment,
    }),
    [transactions, activeTransactions, loading]
  )

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("useTransactions must be used inside TransactionProvider")
  }
  return context
}