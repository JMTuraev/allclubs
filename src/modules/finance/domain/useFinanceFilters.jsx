import { useMemo, useCallback } from "react"
import { useSearchParams } from "react-router-dom"

export function useFinanceFilters(transactions) {
  const [searchParams, setSearchParams] = useSearchParams()

  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const clientParam = searchParams.get("clientId")
  const activeTab = searchParams.get("tab") || "overview"

  /* ========================= */
  /* 📅 DATE FILTER (SAFE)     */
  /* ========================= */

  const dateFilteredTransactions = useMemo(() => {

    if (!from && !to) return transactions

    const start = from ? new Date(from + "T00:00:00") : null
    const end = to ? new Date(to + "T23:59:59") : null

    return transactions.filter((t) => {
      if (!t?.createdAt) return false

      const txDate =
        typeof t.createdAt?.toDate === "function"
          ? t.createdAt.toDate()
          : new Date(t.createdAt)

      if (start && txDate < start) return false
      if (end && txDate > end) return false

      return true
    })

  }, [transactions, from, to])

  /* ========================= */
  /* 👤 CLIENT FILTER          */
  /* ========================= */

  const finalTransactions = useMemo(() => {

    if (!clientParam) return dateFilteredTransactions

    return dateFilteredTransactions.filter(
      (t) => String(t.clientId) === String(clientParam)
    )

  }, [dateFilteredTransactions, clientParam])

  /* ========================= */
  /* 🔧 SAFE PARAM UPDATE      */
  /* ========================= */

  const updateParams = useCallback(
    (updater) => {
      const current = new URLSearchParams(searchParams)
      const next = new URLSearchParams(searchParams)

      updater(next)

      if (current.toString() !== next.toString()) {
        setSearchParams(next)
      }
    },
    [searchParams, setSearchParams]
  )

  /* ========================= */
  /* TAB CHANGE                */
  /* ========================= */

  const changeTab = useCallback(
    (tab) => {
      updateParams((params) => {
        params.set("tab", tab)
      })
    },
    [updateParams]
  )

  /* ========================= */
  /* SET CLIENT FILTER         */
  /* ========================= */

  const setClientFilter = useCallback(
    (clientId) => {
      updateParams((params) => {
        params.set("tab", "transactions")
        params.set("clientId", clientId)
      })
    },
    [updateParams]
  )

  /* ========================= */
  /* CLEAR CLIENT FILTER       */
  /* ========================= */

  const clearClientFilter = useCallback(
    () => {
      updateParams((params) => {
        params.delete("clientId")
      })
    },
    [updateParams]
  )

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