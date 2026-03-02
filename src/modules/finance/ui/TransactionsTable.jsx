import { useMemo } from "react"

export default function TransactionsTable({
  transactions,
  clients,
}) {

  /* ============================= */
  /* SERVICE KO‘RINMAYDI          */
  /* ============================= */

  const visibleTransactions = useMemo(() => {
    return transactions.filter(
      (t) => t.type !== "service"
    )
  }, [transactions])

  /* ============================= */
  /* TOTAL FAqat PAYMENT          */
  /* ============================= */

  const totalAmount = useMemo(() => {
    return visibleTransactions
      .filter(t => t.type === "payment")
      .reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      )
  }, [visibleTransactions])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <h2 className="text-lg font-semibold">
          Transactions
        </h2>

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

              /* 🔴 Replace bilan bog‘liqmi */
              const isReplaceRelated =
                t.meta?.replaceRefund ||
                t.meta?.replacedOriginal ||
                t.meta?.replacedPackageId

              return (
                <tr
                  key={`${t.id}-${i}`}
                  className={`border-t border-white/5 ${
                    isReplaceRelated
                      ? "bg-red-500/10"
                      : ""
                  }`}
                >
                  {/* DATE */}
                  <td className="p-3">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>

                  {/* CLIENT */}
                  <td className="p-3">
                    {client
                      ? `${client.firstName} ${client.lastName}`
                      : "Unknown"}
                  </td>

                  {/* METHOD */}
                  <td
                    className={`p-3 capitalize font-medium ${
                      isReplaceRelated
                        ? "text-red-400"
                        : isNegative
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {t.paymentMethod}
                  </td>

                  {/* AMOUNT */}
                  <td
                    className={`p-3 text-right font-semibold ${
                      isReplaceRelated
                        ? "text-red-500"
                        : isNegative
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