import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

export function useFinanceFilters(transactions) {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlDate = searchParams.get("date")
  const clientParam = searchParams.get("client")
  const activeTab = searchParams.get("tab") || "overview"

  /* DATE FILTER */

  const dateFilteredTransactions = useMemo(() => {
    let result = [...transactions]

    if (urlDate) {
      const selected = new Date(urlDate)

      const start = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      )

      const end = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate() + 1
      )

      result = result.filter(
        (t) =>
          new Date(t.createdAt) >= start &&
          new Date(t.createdAt) < end
      )
    }

    return result
  }, [transactions, urlDate])

  /* CLIENT FILTER */

  const finalTransactions = useMemo(() => {
    if (!clientParam) return dateFilteredTransactions

    return dateFilteredTransactions.filter(
      (t) =>
        String(t.clientId) === String(clientParam)
    )
  }, [dateFilteredTransactions, clientParam])

  /* HANDLERS */

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