export default function ClientBalancesCard({
  balances,
  onClientClick
}) {
  if (!balances || balances.length === 0) {
    return (
      <Card title="Client Overview">
        <div className="text-gray-500 p-6 text-center">
          No client activity
        </div>
      </Card>
    )
  }

  return (
    <Card title="Client Overview">
      <table className="w-full text-sm">
        <thead className="text-gray-400">
          <tr>
            <th className="p-3 text-left">Client</th>
            <th className="p-3 text-right">Total Revenue</th>
            <th className="p-3 text-right">Debt</th>
            <th className="p-3 text-right">Last Activity</th>
          </tr>
        </thead>

        <tbody>
          {balances.map((c) => {
            const totalRevenue = Number(c.totalRevenue || 0)
            const debt = Number(c.debt || 0)

            return (
              <tr
                key={c.clientId}
                className="border-t border-white/5 hover:bg-white/5"
              >
                {/* CLIENT */}
                <td className="p-3">
                  {c.client ? (
                    <button
                      onClick={() =>
                        onClientClick(c.clientId)
                      }
                      className="text-indigo-400 hover:underline font-semibold"
                    >
                      {c.client.firstName}{" "}
                      {c.client.lastName}
                    </button>
                  ) : (
                    "Unknown"
                  )}
                </td>

                {/* TOTAL REVENUE */}
                <td className="p-3 text-right font-semibold text-emerald-400">
                  {totalRevenue.toLocaleString()} сум
                </td>

                {/* DEBT */}
                <td className="p-3 text-right font-semibold text-yellow-400">
                  {debt.toLocaleString()} сум
                </td>

                {/* LAST ACTIVITY */}
                <td className="p-3 text-right text-gray-300">
                  {formatRelativeDate(c.lastActivityDate)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}

/* ============================= */
/* RELATIVE DATE FORMATTER       */
/* ============================= */

function formatRelativeDate(dateString) {
  if (!dateString) return "-"

  const today = new Date()
  const date = new Date(dateString)

  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(
    diffTime / (1000 * 60 * 60 * 24)
  )

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays > 1) return `${diffDays} days ago`

  return "-"
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}