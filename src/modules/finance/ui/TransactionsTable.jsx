import { useMemo } from "react"
import { XMarkIcon } from "@heroicons/react/24/solid"

export default function TransactionsTable({
  transactions,
  clients,
  clientParam,
  filteredClient,
  onClearClient
}) {

  const visibleTransactions = transactions.filter(
    (t) => t.type !== "service"
  )

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
            {totalAmount >= 0 ? "+" : ""}
            {totalAmount.toLocaleString()} сум
          </span>
        </div>
      </div>

      <div className="p-6">
        {visibleTransactions.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No transactions found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {visibleTransactions.map((t, i) => {
                const client = clients.find(
                  (c) => String(c.id) === String(t.clientId)
                )

                const isRefund =
                  t.type === "service_refund"

                const isPayment =
                  t.type === "payment"

                return (
                  <tr
                    key={`${t.id}-${i}`}
                    className={`border-t border-white/5 ${
                      isRefund ? "bg-red-500/5" : ""
                    }`}
                  >
                    {/* DATE */}
                    <td className="p-3">
                      {new Date(
                        t.createdAt
                      ).toLocaleDateString()}
                    </td>

                    {/* CLIENT */}
                    <td className="p-3">
                      {client
                        ? `${client.firstName} ${client.lastName}`
                        : "Unknown"}
                    </td>

                    {/* PRODUCT */}
                    <td className="p-3 text-white">
                      {t.meta?.packageName ||
                        t.meta?.replacedPackage ||
                        "-"}
                    </td>

                    {/* METHOD */}
                    <td className="p-3">
                      {isPayment && (
                        <span className="text-green-400 capitalize font-medium">
                          {t.paymentMethod}
                        </span>
                      )}

                      {isRefund && (
                        <span className="text-red-400 font-medium">
                          Package change
                        </span>
                      )}
                    </td>

                    {/* AMOUNT */}
                    <td
                      className={`p-3 text-right font-semibold ${
                        isRefund
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {t.amount > 0 ? "+" : ""}
                      {t.amount.toLocaleString()} сум
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}