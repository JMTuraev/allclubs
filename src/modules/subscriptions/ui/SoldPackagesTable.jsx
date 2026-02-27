export default function SoldPackagesTable({ data = [] }) {

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-gray-400">
        No sold packages in this period
      </div>
    )
  }

  return (
    <div className="px-6">
      <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Package</th>
              <th className="px-6 py-4 text-left">Visits</th>
              <th className="px-6 py-4 text-left">Start</th>
              <th className="px-6 py-4 text-left">Expire</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {data.map(sub => {
              const isExpired =
                new Date(sub.expiresAt) < new Date()

              return (
                <tr
                  key={sub.id}
                  className="hover:bg-gray-800/40 transition"
                >
                  <td className="px-6 py-4 text-white">
                    {sub.clientName}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {sub.packageSnapshot?.name}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {sub.packageSnapshot?.isUnlimited
                      ? "Unlimited"
                      : `${sub.visitsUsed} / ${sub.visitsTotal}`}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {new Date(sub.startedAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {new Date(sub.expiresAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        isExpired
                          ? "bg-red-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {isExpired ? "Expired" : "Active"}
                    </span>
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