import { UserIcon, PhoneIcon, CalendarDaysIcon } from "@heroicons/react/24/outline"

export default function ClientHeader({ client }) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={client.avatar}
          className="w-14 h-14 rounded-full border-2 border-white/20"
        />
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <UserIcon className="w-4 h-4" />
            {client.name}
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <PhoneIcon className="w-4 h-4" />
            {client.phone}
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-2 text-xs opacity-80 justify-end">
          <CalendarDaysIcon className="w-4 h-4" />
          Expires
        </div>
        <div className="text-sm font-semibold">
          {client.subscription.expires}
        </div>
      </div>
    </div>
  )
}