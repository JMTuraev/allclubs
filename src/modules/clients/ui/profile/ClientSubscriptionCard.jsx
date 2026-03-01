import {
  CubeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  FireIcon,
} from "@heroicons/react/24/outline"

export default function ClientSubscriptionCard({ subscription }) {
  if (!subscription) {
    return (
      <div className="bg-[#111827] rounded-xl p-6 border border-white/5 text-gray-500 text-sm">
        No active subscription
      </div>
    )
  }

  const {
    packageSnapshot,
    visitsUsed,
    visitsTotal,
    expiresAt,
    status,
    startedAt,
  } = subscription

  const isUnlimited = packageSnapshot?.isUnlimited

  const percent =
    !isUnlimited && visitsTotal
      ? Math.min((visitsUsed / visitsTotal) * 100, 100)
      : 100

  const daysLeft = Math.max(
    Math.ceil(
      (new Date(expiresAt) - new Date()) /
        (1000 * 60 * 60 * 24)
    ),
    0
  )

  return (
    <div className="bg-[#111827] rounded-xl p-6 border border-white/5 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <CubeIcon className="w-6 h-6 text-indigo-400" />
          <div>
            <div className="text-white font-semibold text-lg">
              {packageSnapshot?.name}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {packageSnapshot?.duration} days
            </div>
          </div>
        </div>

        <div
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            status === "active"
              ? "bg-green-600/20 text-green-400"
              : status === "expired"
              ? "bg-red-600/20 text-red-400"
              : "bg-yellow-600/20 text-yellow-400"
          }`}
        >
          {status}
        </div>
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <CurrencyDollarIcon className="w-4 h-4" />
        <span>
          {packageSnapshot?.price?.toLocaleString("ru-RU")} сум
        </span>
      </div>

      {/* VISITS */}
      {!isUnlimited && (
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>
              Visits: {visitsUsed} / {visitsTotal}
            </span>
            <span>{Math.round(percent)}%</span>
          </div>

          <div className="bg-gray-800 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {isUnlimited && (
        <div className="flex items-center gap-2 text-sm text-indigo-400">
          <FireIcon className="w-4 h-4" />
          Unlimited visits
        </div>
      )}

      {/* TIME INFO */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4" />
          Started:{" "}
          <span className="text-white ml-1">
            {new Date(startedAt).toLocaleDateString()}
          </span>
        </div>

        <div>
          Expires:{" "}
          <span className="text-white ml-1">
            {new Date(expiresAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {status === "active" && (
        <div className="text-xs text-indigo-400">
          {daysLeft} days left
        </div>
      )}
    </div>
  )
} 