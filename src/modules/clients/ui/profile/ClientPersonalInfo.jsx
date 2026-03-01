import {
  IdentificationIcon,
  UserCircleIcon,
  UserIcon,
  CalendarIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline"

export default function ClientPersonalInfo({ client }) {
  if (!client) return null

  return (
    <div className="bg-[#111827] rounded-xl p-5 border border-white/5 space-y-4">
      
      <div className="text-sm font-semibold text-white">
        Personal Information
      </div>

      {/* ID */}
      <div className="flex items-center gap-3 text-sm">
        <IdentificationIcon className="w-4 h-4 text-indigo-400" />
        <div className="text-gray-400 w-24">Client ID</div>
        <div className="text-white font-medium">
          {client.id}
        </div>
      </div>

      {/* Full Name */}
      <div className="flex items-center gap-3 text-sm">
        <UserIcon className="w-4 h-4 text-indigo-400" />
        <div className="text-gray-400 w-24">Full Name</div>
        <div className="text-white font-medium">
          {client.firstName} {client.lastName}
        </div>
      </div>

      {/* Gender */}
      <div className="flex items-center gap-3 text-sm">
        <UserCircleIcon className="w-4 h-4 text-indigo-400" />
        <div className="text-gray-400 w-24">Gender</div>
        <div className="text-white font-medium capitalize">
          {client.gender || "—"}
        </div>
      </div>

      {/* Age */}
      <div className="flex items-center gap-3 text-sm">
        <CalendarIcon className="w-4 h-4 text-indigo-400" />
        <div className="text-gray-400 w-24">Age</div>
        <div className="text-white font-medium">
          {client.age || "—"}
        </div>
      </div>

      {/* Type */}
      <div className="flex items-center gap-3 text-sm">
        <LockClosedIcon className="w-4 h-4 text-indigo-400" />
        <div className="text-gray-400 w-24">Status</div>
        <div className="text-white font-medium capitalize">
          {client.type || "lead"}
        </div>
      </div>

      {/* Lifetime Spent */}
      <div className="pt-3 border-t border-white/5">
        <div className="text-gray-400 text-xs">
          Lifetime Spent
        </div>
        <div className="text-lg font-semibold text-green-400 mt-1">
          {Number(client.lifetimeSpent || 0).toLocaleString("ru-RU")} сум
        </div>
      </div>

      {/* Created At */}
      <div className="text-xs text-gray-500">
        Member since{" "}
        {client.createdAt
          ? new Date(client.createdAt).toLocaleDateString("ru-RU")
          : "—"}
      </div>

    </div>
  )
}