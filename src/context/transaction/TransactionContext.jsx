import { createContext, useContext, useState, useMemo } from "react"

const TransactionContext = createContext()

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])

  /* ================= ADD ================= */

  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      {
        id: Date.now(),
        createdAt: new Date(),
        status: "active", // active | cancelled
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

  /* ================= CATEGORY ANALYTICS ================= */

  const getCategoryAnalytics = () => {
    const map = {}

    activeTransactions.forEach((t) => {
      if (!t.category) return

      if (!map[t.category]) {
        map[t.category] = {
          services: 0,
          payments: 0,
          expenses: 0,
        }
      }

      if (t.type === "service") {
        map[t.category].services += Number(t.amount)
      }

      if (t.type === "payment") {
        map[t.category].payments += Number(t.amount)
      }

      if (t.type === "expense") {
        map[t.category].expenses += Number(t.amount)
      }
    })

    return Object.entries(map).map(([category, data]) => ({
      category,
      services: data.services,
      payments: data.payments,
      expenses: data.expenses,
      realCash: data.payments,
      profit: data.payments - data.expenses,
    }))
  }

  /* ================= PROVIDER VALUE ================= */

  const value = useMemo(
    () => ({
      transactions,
      activeTransactions,
      addTransaction,
      updateTransactionBySource,
      cancelTransactionBySource,
      getClientBalance,
      getCategoryAnalytics,
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
  return useContext(TransactionContext)
}