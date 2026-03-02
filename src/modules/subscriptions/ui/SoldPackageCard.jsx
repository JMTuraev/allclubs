export default function SoldPackageCard({ subscription }) {
  const {
    clientName,
    packageSnapshot,
    visitLimit,
    remainingVisits,
    startDate,
    endDate,
    status,
  } = subscription

  const now = new Date()
  const expireDate = endDate ? new Date(endDate) : null

  const daysLeft =
    expireDate
      ? Math.max(
          Math.ceil(
            (expireDate - now) /
              (1000 * 60 * 60 * 24)
          ),
          0
        )
      : 0

  const usedVisits =
    visitLimit !== null &&
    visitLimit !== undefined
      ? visitLimit - remainingVisits
      : null

  return (
    <div className="bg-gray-800/70 border border-white/10 rounded-2xl p-5 shadow-lg space-y-3">
      <div className="text-white font-semibold text-lg">
        {clientName}
      </div>

      <div className="text-sm text-gray-400">
        {packageSnapshot?.name}
      </div>

      {visitLimit !== null &&
        visitLimit !== undefined && (
          <div className="text-sm text-gray-300">
            Visits: {usedVisits} / {visitLimit}
          </div>
        )}

      <div className="text-sm text-gray-300">
        Days left: {daysLeft}
      </div>

      <div
        className={`text-xs px-2 py-1 rounded w-fit ${
          status === "expired"
            ? "bg-red-600 text-white"
            : status === "scheduled"
            ? "bg-blue-600 text-white"
            : status === "cancelled"
            ? "bg-gray-600 text-white"
            : "bg-green-600 text-white"
        }`}
      >
        {status}
      </div>
    </div>
  )
}