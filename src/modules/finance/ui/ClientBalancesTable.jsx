export default function ClientBalancesTable({ data, onClientClick }) {
  return (
    <Card title="Client Financial Overview">
      {data?.length === 0 ? (
        <div className="text-gray-500 p-6 text-center">
          No client activity
        </div>
      ) : (
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
            {data.map((c) => {
              const services = Number(c.services || 0)
              const payments = Number(c.payments || 0)
              const balance = Number(c.balance || 0)

              const balanceColor =
                balance > 0
                  ? "text-yellow-400"
                  : balance < 0
                  ? "text-red-400"
                  : "text-white"

              return (
                <tr
                  key={c.clientId}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-3">
                    {c.client ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={c.client.image || "/avatar.png"}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />

                        <div>
                          <button
                            onClick={() =>
                              onClientClick?.(c.clientId)
                            }
                            className="text-indigo-400 hover:underline font-semibold"
                          >
                            {c.client.firstName} {c.client.lastName}
                          </button>

                          <div className="text-xs text-gray-400">
                            ID: {c.client.id}
                          </div>

                          <div className="text-xs text-gray-500">
                            {c.client.phone}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        Unknown
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right text-red-400">
                    {services.toLocaleString()} сум
                  </td>

                  <td className="p-3 text-right text-emerald-400">
                    {payments.toLocaleString()} сум
                  </td>

                  <td className={`p-3 text-right font-semibold ${balanceColor}`}>
                    {balance.toLocaleString()} сум
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </Card>
  )
}