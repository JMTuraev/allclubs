import { createContext, useContext, useState, useMemo } from "react"

const TransactionContext = createContext()

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])

  /* ================= ADD ================= */

  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        status: "active",
        ...transaction,
      },
      ...prev,
    ])
  }

  /* ================= UPDATE BY SOURCE ================= */

  const updateTransactionBySource = (source, sourceId, updates) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.source === source && t.sourceId === sourceId
          ? { ...t, ...updates }
          : t
      )
    )
  }

  /* ================= CANCEL BY SOURCE ================= */

  const cancelTransactionBySource = (source, sourceId) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.source === source && t.sourceId === sourceId
          ? { ...t, status: "cancelled" }
          : t
      )
    )
  }

  /* ================= REPLACE PAYMENT (🔥 YANGI) ================= */

  const replacePayment = (oldTx, amounts) => {
    setTransactions((prev) => {

      // 1️⃣ eski transactionni replaced qilamiz
      const updated = prev.map((t) =>
        t.id === oldTx.id
          ? { ...t, status: "replaced" }
          : t
      )

      // 2️⃣ split paymentlar yaratamiz
      const newTransactions = Object.entries(amounts)
        .filter(([_, amount]) => Number(amount) > 0)
        .map(([method, amount]) => ({
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          status: "active",
          type: "payment",
          clientId: oldTx.clientId,
          paymentMethod: method,
          amount: Number(amount),
          source: oldTx.source || null,
          sourceId: oldTx.sourceId || null,
          meta: oldTx.meta || {}
        }))

      return [...updated, ...newTransactions]
    })
  }

  /* ================= ACTIVE ONLY ================= */

  const activeTransactions = useMemo(
    () => transactions.filter((t) => t.status === "active"),
    [transactions]
  )

  /* ================= CLIENT BALANCE ================= */

  const getClientBalance = (clientId) => {
    if (!clientId) return 0

    const clientTx = activeTransactions.filter(
      (t) => t.clientId === clientId
    )

    const services = clientTx
      .filter((t) => t.type === "service")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const payments = clientTx
      .filter((t) => t.type === "payment")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return services - payments
  }

  /* ================= PROVIDER VALUE ================= */

  const value = useMemo(
    () => ({
      transactions,
      activeTransactions,
      addTransaction,
      updateTransactionBySource,
      cancelTransactionBySource,
      replacePayment, // 🔥 qo‘shildi
      getClientBalance,
    }),
    [transactions, activeTransactions]
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