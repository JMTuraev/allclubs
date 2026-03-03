import { useMemo } from "react"

export function useClientBalances(transactions, clients) {
  return useMemo(() => {

    const map = {}

    transactions.forEach((t) => {

      if (!t?.clientId) return

      // 🔥 STATUS FILTER OLIB TASHLANDI
      // 🔥 TYPE FILTER OLIB TASHLANDI

      const id = String(t.clientId)

      const rawAmount = String(t.amount ?? 0).replace(/\s/g, "")
      const amount = Number(rawAmount)

      if (isNaN(amount)) return

      if (!map[id]) {
        map[id] = {
          totalRevenue: 0,
          debt: 0,
          methods: {},
          lastActivityDate: null
        }
      }

      /* ============================= */
      /* 💰 TOTAL REVENUE (NET LEDGER) */
      /* ============================= */

      map[id].totalRevenue += amount

      /* ============================= */
      /* 💳 PAYMENT METHOD AGGREGATION */
      /* ============================= */

      const method = (t.paymentMethod || "unknown").toLowerCase()

      if (!map[id].methods[method]) {
        map[id].methods[method] = 0
      }

      map[id].methods[method] += amount

      /* ============================= */
      /* 🔴 DEBT LOGIC                 */
      /* ============================= */

      if (method === "debt") {
        map[id].debt += amount
      }

      /* ============================= */
      /* 🕒 LAST ACTIVITY              */
      /* ============================= */

      if (t.createdAt) {
        const txDate =
          typeof t.createdAt.toDate === "function"
            ? t.createdAt.toDate()
            : new Date(t.createdAt)

        if (
          !map[id].lastActivityDate ||
          txDate > new Date(map[id].lastActivityDate)
        ) {
          map[id].lastActivityDate = txDate
        }
      }

    })

    return Object.entries(map).map(([clientId, data]) => {

      const client = clients.find(
        (c) => String(c.id) === String(clientId)
      )

      return {
        clientId,
        client,
        totalRevenue: data.totalRevenue,
        debt: data.debt,
        methods: data.methods,
        lastActivityDate: data.lastActivityDate
      }
    })

  }, [transactions, clients])
}