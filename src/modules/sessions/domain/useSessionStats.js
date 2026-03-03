import { useMemo } from "react"
import { useSessionsContext } from "./SessionsContext"

export function useSessionStats() {
  const { sessions } = useSessionsContext()

  return useMemo(() => {
    let bar = 0
    let packageRevenue = 0
    let trainer = 0

    sessions.forEach(s => {
      const txList = Array.isArray(s.transactions)
        ? s.transactions
        : []

      txList.forEach(tx => {
        if (tx.type === "bar") bar += tx.amount || 0
        if (tx.type === "package") packageRevenue += tx.amount || 0
        if (tx.type === "trainer") trainer += tx.amount || 0
      })
    })

    return { bar, packageRevenue, trainer }
  }, [sessions])
}