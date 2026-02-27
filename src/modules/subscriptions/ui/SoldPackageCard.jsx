export default function SoldPackageCard({ subscription }) {
  const {
    clientName,
    packageSnapshot,
    visitsUsed,
    visitsTotal,
    startedAt,
    expiresAt,
  } = subscription

  const now = new Date()
  const expireDate = new Date(expiresAt)
  const isExpired = now > expireDate

  const daysLeft = Math.max(
    Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24)),
    0
  )

  return (
    <div className="bg-gray-800/70 border border-white/10 rounded-2xl p-5 shadow-lg space-y-3">
      <div className="text-white font-semibold text-lg">
        {clientName}
      </div>

      <div className="text-sm text-gray-400">
        {packageSnapshot?.name}
      </div>

      {!packageSnapshot?.isUnlimited && (
        <div className="text-sm text-gray-300">
          Visits: {visitsUsed} / {visitsTotal}
        </div>
      )}

      <div className="text-sm text-gray-300">
        Days left: {daysLeft}
      </div>

      <div
        className={`text-xs px-2 py-1 rounded w-fit ${
          isExpired
            ? "bg-red-600 text-white"
            : "bg-green-600 text-white"
        }`}
      >
        {isExpired ? "Expired" : "Active"}
      </div>
    </div>
  )
}