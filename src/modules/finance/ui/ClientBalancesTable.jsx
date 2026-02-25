

export default function ClientBalancesTable({ data, onClientClick }) {
  return (
 

      {data.length === 0 ? (
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
            {data.map((c) => (
              <tr
                key={c.clientId}
                className="border-t border-white/5"
              >
                <td className="p-3">
                  {c.client ? (
                    <div className="flex items-center gap-3">

                      <img
                        src={c.client.image}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />

                      <div>
                        <button
                          onClick={() =>
                            onClientClick(c.clientId)
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
      )}

    </Card>
  )
}