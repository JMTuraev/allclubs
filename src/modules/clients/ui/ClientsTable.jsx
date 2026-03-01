import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useSessionsContext } from "../../sessions/domain/SessionsContext"
import { useSessionSelectors } from "../../sessions/domain/useSessionSelectors"
import { useSubscriptionsContext } from "../../subscriptions/domain/SubscriptionsContext"

import KeypadModal from "../../../components/modals/KeypadModal"
import ActivatePackageDrawer from "../../subscriptions/ui/ActivatePackageDrawer"

export default function ClientsTable({ clients }) {
  const navigate = useNavigate()

  const { startSession, endSession } = useSessionsContext()
  const { getActiveSessionByClient } = useSessionSelectors()

  const {
    getActiveSubscriptionByClient,
    incrementVisit,
  } = useSubscriptionsContext()

  const [keyClient, setKeyClient] = useState(null)
  const [activateClient, setActivateClient] = useState(null)
  const [closeData, setCloseData] = useState(null)

  return (
    <>
      <div className="bg-gray-900 border border-white/10 rounded-2xl">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
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
              const activeSession =
                getActiveSessionByClient(client.id)

              const subscription =
                getActiveSubscriptionByClient(client.id)

              const hasActivePackage =
                subscription && !subscription.isExpired

              /* ================= PROGRESS ================= */

              let visitPercent = 0
              let visitsUsed = 0
              let visitsTotal = 0
              let visitsLeft = 0

              if (hasActivePackage) {
                const now = new Date()

                visitsUsed = subscription.visitsUsed || 0
                visitsTotal = subscription.visitsTotal || 0

                const startDate = new Date(subscription.startedAt)
                const expireDate = new Date(subscription.expiresAt)

                const totalDays =
                  (expireDate - startDate) /
                  (1000 * 60 * 60 * 24)

                const usedDays =
                  (now - startDate) /
                  (1000 * 60 * 60 * 24)

                const daysPercent =
                  totalDays > 0
                    ? Math.min((usedDays / totalDays) * 100, 100)
                    : 0

                if (subscription.packageSnapshot.isUnlimited) {
                  visitPercent = daysPercent
                } else {
                  visitPercent =
                    visitsTotal > 0
                      ? Math.min(
                          (visitsUsed / visitsTotal) * 100,
                          100
                        )
                      : 0

                  visitsLeft = visitsTotal - visitsUsed
                  visitPercent = Math.max(
                    visitPercent,
                    daysPercent
                  )
                }
              }

              const canCheckIn =
                hasActivePackage &&
                (subscription.packageSnapshot.isUnlimited ||
                  visitsLeft > 0)

              return (
                <tr
                  key={client.id}
                  className="hover:bg-gray-800/40 transition"
                >
                  {/* № */}
                  <td className="px-6 py-6 text-gray-400">
                    {index + 1}
                  </td>

                  {/* CLIENT */}
                  <td className="px-6 py-6">
                    <div
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() =>
                        navigate(`/app/clients/${client.id}`)
                      }
                    >
                      <img
                        src={client.image}
                        className="h-14 w-14 rounded-full object-cover border border-white/10"
                        alt={client.firstName}
                      />
                      <div>
                        <div className="text-xs text-gray-500">
                          ID: {client.id}
                        </div>
                        <div className="text-white font-semibold text-base">
                          {client.firstName} {client.lastName}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {client.phone}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* PACKAGE */}
                  <td className="px-6 py-6">
                    {hasActivePackage ? (
                      <>
                        <div className="text-white">
                          {subscription.packageSnapshot.name}
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs">
                          {!subscription.packageSnapshot.isUnlimited && (
                            <span className="text-gray-400">
                              {visitsUsed} / {visitsTotal}
                            </span>
                          )}
                          <span className="text-indigo-400 ml-2">
                            {Math.round(visitPercent)}%
                          </span>
                        </div>

                        <div className="mt-2 bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${visitPercent}%`,
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setActivateClient(client)
                        }
                        className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                      >
                        Activate Package
                      </button>
                    )}
                  </td>

                  {/* LOCKER */}
                  <td className="px-6 py-6">
                    {activeSession ? (
                      <div className="space-y-2">
                        <div className="text-emerald-400 text-sm">
                          Locker: {activeSession.lockerCode}
                        </div>

                        <button
                          onClick={() =>
                            setCloseData({
                              session: activeSession,
                              client,
                            })
                          }
                          className="px-4 py-2 text-xs bg-red-600 hover:bg-red-500 rounded-lg transition"
                        >
                          Close Session
                        </button>
                      </div>
                    ) : canCheckIn ? (
                      <button
                        onClick={() =>
                          setKeyClient(client)
                        }
                        className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                      >
                        Give Key
                      </button>
                    ) : (
                      <span className="text-gray-500 text-xs">
                        No active package
                      </span>
                    )}
                  </td>

                  {/* ACTIVITY */}
                  <td className="px-6 py-6 text-sm">
                    {activeSession ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/app/sessions?client=${client.id}`
                          )
                        }
                        className="text-emerald-400 hover:underline"
                      >
                        View session
                      </button>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ACTIVATE DRAWER */}
      {activateClient && (
        <ActivatePackageDrawer
          client={activateClient}
          onClose={() => setActivateClient(null)}
        />
      )}

      {/* CHECK-IN MODAL */}
      {keyClient && (
        <KeypadModal
          mode="checkin"
          onClose={() => setKeyClient(null)}
          onConfirm={(lockerCode) => {
            const sub =
              getActiveSubscriptionByClient(
                keyClient.id
              )

            if (!sub || sub.isExpired) return

            startSession({
              clientId: keyClient.id,
              clientName:
                keyClient.firstName +
                " " +
                keyClient.lastName,
              staffName: "Admin",
              lockerCode,
            })

            if (!sub.packageSnapshot.isUnlimited) {
              incrementVisit(sub.id)
            }

            setKeyClient(null)
          }}
        />
      )}

      {/* CLOSE SESSION MODAL */}
      {closeData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111827] w-[400px] rounded-2xl p-6 space-y-5 border border-white/10">
            <div className="text-lg font-semibold">
              Confirm Session Close
            </div>

            <div className="text-sm text-gray-400">
              Client: {closeData.client.firstName}{" "}
              {closeData.client.lastName}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setCloseData(null)}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  endSession(closeData.session.id)
                  setCloseData(null)
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}