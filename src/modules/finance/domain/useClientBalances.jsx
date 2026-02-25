import { useMemo } from "react"

export function useClientBalances(transactions, clients) {
  return useMemo(() => {
    const map = {}

    transactions.forEach((t) => {
      if (!t.clientId) return

      const id = String(t.clientId)

      if (!map[id]) {
        map[id] = { services: 0, payments: 0 }
      }

      if (t.type === "service") map[id].services += t.amount
      if (t.type === "payment") map[id].payments += t.amount
    })

    return Object.entries(map).map(([clientId, data]) => {
      const client = clients.find(
        (c) => String(c.id) === String(clientId)
      )

      return {
        clientId,
        client,
        services: data.services,
        payments: data.payments,
        balance: data.services - data.payments
      }
    })
  }, [transactions, clients])
}