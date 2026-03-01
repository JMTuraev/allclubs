import { useMemo, useState } from "react"
import PaymentModal from "../../../components/modals/PaymentModal"

export default function TransactionsTable({
  transactions,
  clients,
  clientParam,
  filteredClient,
  onClearClient,
  onReplacePayment
}) {

  const [editingTx, setEditingTx] = useState(null)

  /* ============================= */
  /* FILTER SERVICE               */
  /* ============================= */

  const visibleTransactions = useMemo(() => {
    return transactions.filter(
      (t) => t.type !== "service"
    )
  }, [transactions])

  /* ============================= */
  /* TOTAL (FAKT ACTIVE)          */
  /* ============================= */

  const totalAmount = useMemo(() => {
    return visibleTransactions
      .filter(t => t.status !== "replaced")
      .reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      )
  }, [visibleTransactions])

  /* ============================= */
  /* EDIT CONFIRM                 */
  /* ============================= */

  const handleConfirmEdit = async ({ amounts }) => {
    if (!editingTx) return

    const total = Object.values(amounts).reduce(
      (sum, v) => sum + Number(v || 0),
      0
    )

    // amount 0 bo‘lsa confirm qilmaymiz
    if (!total || total <= 0) return

    // xavfsizlik: umumiy summa o‘zgarmasligi kerak
    if (Number(total) !== Number(editingTx.amount)) return

    if (onReplacePayment) {
      await onReplacePayment(editingTx, amounts)
    }

    setEditingTx(null)
  }

  return (
    <>
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
                  <th className="p-3 text-right"></th>
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

                  const isReplaced =
                    t.status === "replaced"

                  return (
                    <tr
                      key={`${t.id}-${i}`}
                      className={`border-t border-white/5 ${
                        isRefund
                          ? "bg-red-500/5"
                          : isReplaced
                          ? "opacity-40"
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

                      {/* PRODUCT */}
                      <td className="p-3 text-white">
                        {t.meta?.packageName ||
                          t.meta?.replacedPackage ||
                          "-"}
                      </td>

                      {/* METHOD */}
                      <td className="p-3">
                        {isPayment && (
                          <span
                            className={`capitalize font-medium ${
                              isReplaced
                                ? "text-gray-400"
                                : "text-green-400"
                            }`}
                          >
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
                            : isReplaced
                            ? "text-gray-400"
                            : "text-green-400"
                        }`}
                      >
                        {t.amount > 0 ? "+" : ""}
                        {Number(t.amount).toLocaleString()} сум
                      </td>

                      {/* EDIT */}
                      <td className="p-3 text-right">
                        {isPayment && !isReplaced && (
                          <button
                            onClick={() => setEditingTx(t)}
                            className="text-indigo-400 hover:text-white text-sm"
                          >
                            Edit
                          </button>
                        )}
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {editingTx && (
        <PaymentModal
          total={editingTx.amount}
          client={{
            name: `${editingTx.meta?.clientName || ""}`
          }}
          checkNumber={editingTx.checkNumber}
          onClose={() => setEditingTx(null)}
          onConfirm={handleConfirmEdit}
        />
      )}
    </>
  )
}