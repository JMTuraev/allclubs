import {
  UserIcon,
  PhoneIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline"

export default function ClientHeader({
  client,
  subscription,
  balance = 0,
}) {
  if (!client) return null

  const hasSubscription = Boolean(subscription)

  const expiresText = hasSubscription
    ? new Date(subscription.expiresAt).toLocaleDateString("ru-RU")
    : "No active package"

  const statusColor = !hasSubscription
    ? "text-gray-300"
    : subscription.status === "active"
    ? "text-green-300"
    : subscription.status === "expired"
    ? "text-red-300"
    : "text-yellow-300"

    console.log("heaeder", client, "heaeder");
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl px-6 py-6 flex items-center justify-between">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        <div className="relative">
          <img
            src={client.image || "/avatar-placeholder.png"}
            alt={client?.firstName}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
          />

          {hasSubscription && subscription.status === "active" && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-indigo-600" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <UserIcon className="w-4 h-4" />
            {client.name} {client.lastName}
          </div>

          <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
            <PhoneIcon className="w-4 h-4" />
            {client.phone}
          </div>

          <div className="text-xs text-white/70 mt-2">
            Balance:{" "}
            <span className="font-semibold">
              {Number(balance || 0).toLocaleString("ru-RU")} сум
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="text-right text-white">
        <div className="flex items-center gap-2 text-xs opacity-80 justify-end">
          <CalendarDaysIcon className="w-4 h-4" />
          Expires
        </div>

        <div className={`text-sm font-semibold mt-1 ${statusColor}`}>
          {expiresText}
        </div>
      </div>
    </div>
  )
}