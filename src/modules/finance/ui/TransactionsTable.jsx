import { useMemo } from "react"

export default function TransactionsTable({
  transactions,
  clients,
  clientIdFilter,
  onClearClientFilter
}) {

  /* ============================= */
  /* CLIENT MAP (PERFORMANCE)      */
  /* ============================= */

  const clientsMap = useMemo(() => {
    const map = new Map()
    clients.forEach((c) => {
      map.set(String(c.id), c)
    })
    return map
  }, [clients])

  /* ============================= */
  /* FILTER LOGIC                  */
  /* ============================= */

  const visibleTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.status !== "cancelled")
      .filter((t) => {
        if (!clientIdFilter) return true
        return String(t.clientId) === String(clientIdFilter)
      })
  }, [transactions, clientIdFilter])

  /* ============================= */
  /* CLIENT BADGE                  */
  /* ============================= */

  const filteredClient = useMemo(() => {
    if (!clientIdFilter) return null
    return clientsMap.get(String(clientIdFilter))
  }, [clientIdFilter, clientsMap])

  /* ============================= */
  /* TOTAL                         */
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
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>

            {visibleTransactions.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6 text-gray-500"
                >
                  No transactions found
                </td>
              </tr>
            )}

            {visibleTransactions.map((t) => {

              const client = clientsMap.get(String(t.clientId))

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
                  key={t.id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >

                  {/* DATE */}

                  <td className="p-3">
                    {date
                      ? date.toLocaleDateString()
                      : "-"}
                  </td>

                  {/* CLIENT */}

                  <td className="p-3">
                    {client
                      ? `${client.firstName} ${client.lastName}`
                      : "System"}
                  </td>

                  {/* TYPE */}

                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${getTypeColor(t)}`}
                    >
                      {getTypeLabel(t)}
                    </span>
                  </td>

                  {/* METHOD */}

                  <td className="p-3">
                    <span className="text-xs px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-medium">
                      {getPaymentMethod(t)}
                    </span>
                  </td>

                  {/* AMOUNT */}

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

/* ============================= */
/* PAYMENT METHOD                */
/* ============================= */

function getPaymentMethod(t) {

  const method =
    t.paymentMethod ??
    t.method ??
    t.payment_type ??
    null

  if (!method) return "—"

  const map = {
    cash: "Cash",
    card: "Card",
    click: "Click",
    payme: "Payme",
    transfer: "Transfer"
  }

  return map[method] || method
}

/* ============================= */
/* TYPE LABEL                    */
/* ============================= */

function getTypeLabel(t) {

  if (t.category === "package") return "Package"

  if (t.type === "bar") return "Bar"

  if (t.type === "expense") return "Expense"

  if (t.type === "service") return "Service"

  return "Other"
}

/* ============================= */
/* TYPE COLOR                    */
/* ============================= */

function getTypeColor(t) {

  if (t.category === "package")
    return "bg-green-500/20 text-green-400"

  if (t.type === "bar")
    return "bg-blue-500/20 text-blue-400"

  if (t.type === "expense")
    return "bg-red-500/20 text-red-400"

  if (t.type === "service")
    return "bg-purple-500/20 text-purple-400"

  return "bg-gray-500/20 text-gray-300"
}