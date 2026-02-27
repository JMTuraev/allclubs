import { useMemo } from "react"
import { useSubscriptionsContext } from "../domain/SubscriptionsContext"

export default function SoldPackagesList() {
  const { subscriptions = [] } = useSubscriptionsContext()

  const rows = useMemo(() => {
    return subscriptions.map(sub => {
      const now = new Date()
      const expireDate = sub.expiresAt
        ? new Date(sub.expiresAt)
        : null

      const isExpired =
        expireDate ? expireDate < now : false

      return {
        ...sub,
        isExpired,
      }
    })
  }, [subscriptions])

  if (rows.length === 0) {
    return (
      <div className="p-6 text-gray-400">
        No sold packages yet
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
            {rows.map(sub => (
              <tr
                key={sub.id}
                className="hover:bg-gray-800/40 transition"
              >
                {/* CLIENT INFO */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">
                      {sub.clientName || "Unknown Client"}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {sub.clientPhone || ""}
                    </span>
                  </div>
                </td>

                {/* PACKAGE */}
                <td className="px-6 py-4 text-gray-300">
                  {sub.packageSnapshot?.name}
                </td>

                {/* VISITS */}
                <td className="px-6 py-4 text-gray-400">
                  {sub.packageSnapshot?.isUnlimited
                    ? "Unlimited"
                    : `${sub.visitsUsed ?? 0} / ${sub.visitsTotal ?? 0}`}
                </td>

                {/* START */}
                <td className="px-6 py-4 text-gray-400">
                  {sub.startedAt
                    ? new Date(sub.startedAt).toLocaleDateString()
                    : "—"}
                </td>

                {/* EXPIRE */}
                <td className="px-6 py-4 text-gray-400">
                  {sub.expiresAt
                    ? new Date(sub.expiresAt).toLocaleDateString()
                    : "—"}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      sub.isExpired
                        ? "bg-red-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {sub.isExpired ? "Expired" : "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}