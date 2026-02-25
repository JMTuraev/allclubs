export default function ClientBalancesCard({
  balances,
  onClientClick
}) {
  if (balances.length === 0) {
    return (
      <Card title="Client Balances">
        <div className="text-gray-500 p-6 text-center">
          No client activity
        </div>
      </Card>
    )
  }

  return (
    <Card title="Client Balances">
      <table className="w-full text-sm">
        <thead className="text-gray-400">
          <tr>
            <th className="p-3 text-left">Client</th>
            <th className="p-3 text-right">Services</th>
            <th className="p-3 text-right">Payments</th>
            <th className="p-3 text-right">Balance</th>
          </tr>
        </thead>

        <tbody>
          {balances.map((c) => (
            <tr
              key={c.clientId}
              className="border-t border-white/5"
            >
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

              <td className="p-3 text-right text-red-400">
                {c.services.toLocaleString()} сум
              </td>

              <td className="p-3 text-right text-emerald-400">
                {c.payments.toLocaleString()} сум
              </td>

              <td className="p-3 text-right font-semibold text-white">
                {c.balance.toLocaleString()} сум
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}