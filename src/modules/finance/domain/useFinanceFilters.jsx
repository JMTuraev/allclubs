import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

export function useFinanceFilters(transactions) {
  const [searchParams, setSearchParams] = useSearchParams()

  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const clientParam = searchParams.get("client")
  const activeTab = searchParams.get("tab") || "overview"

  /* ========================= */
  /* 📅 DATE FILTER (RANGE SAFE) */
  /* ========================= */

  const dateFilteredTransactions = useMemo(() => {

    if (!from && !to) return transactions

    const start = from ? new Date(from + "T00:00:00") : null
    const end = to ? new Date(to + "T23:59:59") : null

    return transactions.filter((t) => {
      if (!t?.createdAt) return false

      const txDate = new Date(t.createdAt)

      if (start && txDate < start) return false
      if (end && txDate > end) return false

      return true
    })

  }, [transactions, from, to])

  /* ========================= */
  /* 👤 CLIENT FILTER         */
  /* ========================= */

  const finalTransactions = useMemo(() => {

    if (!clientParam) return dateFilteredTransactions

    return dateFilteredTransactions.filter(
      (t) => String(t.clientId) === String(clientParam)
    )

  }, [dateFilteredTransactions, clientParam])

  /* ========================= */
  /* 🔧 HANDLERS (SAFE)       */
  /* ========================= */

  const changeTab = (tab) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", tab)
    setSearchParams(params)
  }

  const setClientFilter = (clientId) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", "transactions")
    params.set("client", clientId)
    setSearchParams(params)
  }

  const clearClientFilter = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("client")
    setSearchParams(params)
  }

  return {
    activeTab,
    clientParam,
    finalTransactions,
    dateFilteredTransactions,
    changeTab,
    setClientFilter,
    clearClientFilter
  }
}