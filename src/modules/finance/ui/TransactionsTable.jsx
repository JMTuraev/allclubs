import { XMarkIcon } from "@heroicons/react/24/solid"

export default function TransactionsTable({
  transactions,
  clients,
  clientParam,
  filteredClient,
  onClearClient
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <h2 className="text-lg font-semibold">
          Transactions
        </h2>

        {clientParam && filteredClient && (
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
            <span>
              {filteredClient.firstName}{" "}
              {filteredClient.lastName}
            </span>

            <button
              onClick={onClearClient}
              className="hover:text-white transition"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No transactions found
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, i) => {
                const client = clients.find(
                  (c) =>
                    String(c.id) === String(t.clientId)
                )

                return (
                  <tr
                    key={`${t.id}-${i}`}
                    className="border-t border-white/5"
                  >
                    <td className="p-3">
                      {new Date(
                        t.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      {client
                        ? `${client.firstName} ${client.lastName}`
                        : "Unknown"}
                    </td>

                    <td className="p-3">
                      {t.type}
                    </td>

                    <td className="p-3 text-right font-semibold text-white">
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