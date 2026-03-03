import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  collection,
  addDoc,
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
    const txRef = collection(db, "gyms", gymId, "transactions")

    // Reverse
    await addDoc(txRef, {
      type: "payment_reverse",
      clientId: String(oldTx.clientId),
      paymentMethod: oldTx.paymentMethod,
      amount: -Math.abs(Number(oldTx.amount)),
      meta: {
        originalTxId: oldTx.id,
      },
      createdAt: serverTimestamp(),
    })

    // New entries
    const entries = Object.entries(amounts).filter(
      ([_, amount]) => Number(amount) > 0
    )

    for (const [method, amount] of entries) {
      await addDoc(txRef, {
        type: "payment",
        clientId: String(oldTx.clientId),
        paymentMethod: method,
        amount: Number(amount),
        meta: {
          replacedOriginal: oldTx.id,
        },
        createdAt: serverTimestamp(),
      })
    }
  }

  const activeTransactions = useMemo(() => {
    return transactions
  }, [transactions])

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        activeTransactions,
        loading,
        replacePayment,
      }}
    >
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