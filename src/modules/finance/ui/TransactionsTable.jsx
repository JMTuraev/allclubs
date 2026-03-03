import { useMemo } from "react"

export default function TransactionsTable({
  transactions,
  clients,
  clientIdFilter,
  onClearClientFilter
}) {

  /* ============================= */
  /* FILTER LOGIC                 */
  /* ============================= */

  const visibleTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.status !== "cancelled")
      .filter((t) => t.type !== "service")
      .filter((t) => {
        if (!clientIdFilter) return true
        return String(t.clientId) === String(clientIdFilter)
      })
  }, [transactions, clientIdFilter])

  /* ============================= */
  /* CLIENT INFO FOR BADGE        */
  /* ============================= */

  const filteredClient = useMemo(() => {
    if (!clientIdFilter) return null
    return clients.find(
      (c) => String(c.id) === String(clientIdFilter)
    )
  }, [clients, clientIdFilter])

  /* ============================= */
  /* TOTAL                        */
  /* ============================= */

  const totalAmount = useMemo(() => {
    return visibleTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    )
  }, [visibleTransactions])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">

        <div className="flex items-center gap-3">

          <h2 className="text-lg font-semibold">
            Transactions
          </h2>

          {/* CLIENT FILTER BADGE */}
          {filteredClient && (
            <div className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">
              {filteredClient.firstName} {filteredClient.lastName}

              <button
                onClick={onClearClientFilter}
                className="ml-1 text-indigo-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
          )}

        </div>

        {/* TOTAL */}
        <div className="text-sm">
          <span className="text-gray-400 mr-2">
            Total:
          </span>
          <span
            className={`font-semibold ${
              totalAmount >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {totalAmount > 0 && "+"}
            {totalAmount.toLocaleString()} сум
          </span>
        </div>

      </div>

      {/* TABLE */}
      <div className="p-6">
        <table className="w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {visibleTransactions.map((t, i) => {

              const client = clients.find(
                (c) => String(c.id) === String(t.clientId)
              )

              const amount = Number(t.amount || 0)
              const isNegative = amount < 0

              const date =
                t.createdAt?.toDate
                  ? t.createdAt.toDate()
                  : t.createdAt
                  ? new Date(t.createdAt)
                  : null

              return (
                <tr
                  key={`${t.id}-${i}`}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-3">
                    {date
                      ? date.toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3">
                    {client
                      ? `${client.firstName} ${client.lastName}`
                      : "Unknown"}
                  </td>

                  <td
                    className={`p-3 capitalize font-medium ${
                      isNegative
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {t.paymentMethod}
                  </td>

                  <td
                    className={`p-3 text-right font-semibold ${
                      isNegative
                        ? "text-red-500"
                        : "text-green-400"
                    }`}
                  >
                    {!isNegative && "+"}
                    {amount.toLocaleString()} сум
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}