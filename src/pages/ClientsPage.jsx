import { KeyIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"

const clients = [
  {
    id: 124,
    name: "Lindsay Walton",
    phone: "+998 90 123 45 67",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&q=80",
    online: true,
    gender: "female",
    packageName: "1 Month",
    visitsUsed: 3,
    visitsTotal: 30,
    expectedVisits: 4,
    trainerImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&q=80",
    lifetimeSpent: 1250000,
    lastAction: "Session today",
    locker: "A12",
  },
]

export default function ClientsPage() {
  const navigate = useNavigate()

  return (
    <div className="px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">

          <table className="min-w-full divide-y divide-white/10 text-sm">

            <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left w-16">№</th>
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-left">Package</th>
                <th className="px-6 py-4 text-left">Locker</th>
                <th className="px-6 py-4 text-left">Activity</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {clients.map((client, index) => {

                const absent =
                  client.expectedVisits - client.visitsUsed

                const visitPercent =
                  (client.visitsUsed / client.visitsTotal) * 100

                return (
                  <tr
                    key={client.id}
                    className={`transition ${
                      client.online
                        ? "hover:bg-gray-800/40"
                        : "opacity-50"
                    }`}
                  >

                    <td className="px-6 py-6 text-gray-400">
                      {index + 1}
                    </td>

                    <td className="px-6 py-6">
                    <div
  className="flex items-center gap-4 cursor-pointer"
  onClick={() =>
    window.open(`/client/${client.id}`, "_blank")
  }
>

                        <div className="relative">

                          <img
                            src={client.image}
                            className="h-14 w-14 rounded-full object-cover border border-white/10"
                          />

                          <div className={`absolute top-0 left-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold border-2 border-gray-900 ${
                            client.gender === "male"
                              ? "bg-blue-500"
                              : "bg-pink-500"
                          }`}>
                            {client.gender === "male" ? "♂" : "♀"}
                          </div>

                          <span
                            className={`absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-gray-900 ${
                              client.online
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          />

                          {client.trainerImage && (
                            <img
                              src={client.trainerImage}
                              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-gray-900 object-cover"
                            />
                          )}

                        </div>

                        <div>
                          <div className="text-xs text-gray-500">
                            ID: {client.id}
                          </div>

                          <div className="text-white font-semibold text-base hover:text-indigo-400 transition">
                            {client.name}
                          </div>

                          <div className="text-gray-400 text-sm">
                            {client.phone}
                          </div>
                        </div>

                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <div className="text-white">
                        {client.packageName}
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="text-gray-400">
                          {client.expectedVisits}
                        </span>

                        {absent > 0 && (
                          <span className="text-red-500 font-semibold">
                            -{absent}
                          </span>
                        )}

                        <span className="text-gray-400">
                          / {client.visitsTotal}
                        </span>

                        <span className="text-indigo-400 ml-2">
                          {Math.round(visitPercent)}%
                        </span>
                      </div>

                      <div className="mt-2 bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${visitPercent}%` }}
                        />
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      {client.locker ? (
                        <div className="flex items-center gap-2 text-indigo-400">
                          <KeyIcon className="h-5 w-5" />
                          {client.locker}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-6">
                      <div className="text-green-400 font-semibold text-sm">
                        {client.lifetimeSpent.toLocaleString("ru-RU")} сум
                      </div>

                      <div className="text-gray-400 text-xs mt-1">
                        {client.lastAction}
                      </div>
                    </td>

                  </tr>
                )
              })}
            </tbody>

          </table>

        </div>
      </div>
    </div>
  )
}