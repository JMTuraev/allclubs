import { useMemo } from "react"
import { useSessionsContext } from "./SessionsContext"

export function useSessionStats() {
  const { sessions } = useSessionsContext()

  return useMemo(() => {
    let bar = 0
    let packageRevenue = 0
    let trainer = 0

    sessions.forEach(s => {
      s.transactions.forEach(tx => {
        if (tx.type === "bar") bar += tx.amount
        if (tx.type === "package") packageRevenue += tx.amount
        if (tx.type === "trainer") trainer += tx.amount
      })
    })

    return { bar, packageRevenue, trainer }
  }, [sessions])
}