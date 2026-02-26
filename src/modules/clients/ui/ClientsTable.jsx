import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useSessionsContext } from "../../sessions/domain/SessionsContext"
import { useSessionSelectors } from "../../sessions/domain/useSessionSelectors"

import { useSubscriptionsContext } from "../../subscriptions/domain/SubscriptionsContext"

import PaymentModal from "../../../components/modals/PaymentModal"
import KeypadModal from "../../../components/modals/KeypadModal"
import ActivatePackageDrawer from "../../subscriptions/ui/ActivatePackageDrawer"

export default function ClientsTable({ clients }) {
  const navigate = useNavigate()

  /* ===== SESSIONS ===== */
  const { markSessionsPaid, startSession, endSession } =
    useSessionsContext()

  const {
    getActiveSessionByClient,
    getUnpaidTotalByClient,
    getUnpaidSessionsByClient,
  } = useSessionSelectors()

  /* ===== SUBSCRIPTIONS ===== */
  const {
    incrementVisit,
    getActiveSubscriptionByClient,
  } = useSubscriptionsContext()

  /* ===== STATE ===== */
  const [paymentClient, setPaymentClient] = useState(null)
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

              const activeSubscription =
                getActiveSubscriptionByClient(client.id)

              const hasPackage = !!activeSubscription

              let visitPercent = 0
              let visitsUsed = 0
              let visitsTotal = 0
              let visitsLeft = 0
              let isExpired = false

              if (activeSubscription) {
                visitsUsed =
                  activeSubscription.visitsUsed ?? 0

                visitsTotal =
                  activeSubscription.visitsTotal ?? 0

                visitsLeft =
                  visitsTotal - visitsUsed

                isExpired =
                  activeSubscription.status === "expired"

                visitPercent =
                  visitsTotal > 0
                    ? Math.min(
                        (visitsUsed /
                          visitsTotal) *
                          100,
                        100
                      )
                    : 0
              }

              const sessionTotal =
                activeSession?.totalAmount || 0

              const canCheckIn =
                hasPackage &&
                !isExpired &&
                visitsLeft > 0

              return (
                <tr
                  key={client.id}
                  className="hover:bg-gray-800/40 transition"
                >
                  {/* NUMBER */}
                  <td className="px-6 py-6 text-gray-400">
                    {index + 1}
                  </td>

                  {/* CLIENT */}
                  <td className="px-6 py-6">
                    <div
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() =>
                        navigate(`/clients/${client.id}`)
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
                        <div className="text-white font-semibold text-base hover:text-indigo-400 transition">
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
                    {hasPackage ? (
                      <>
                        <div className="text-white">
                          {activeSubscription.packageName}
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="text-gray-400">
                            {visitsUsed} / {visitsTotal}
                          </span>

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

                        {isExpired && (
                          <div className="text-red-400 text-xs mt-2">
                            Package expired
                          </div>
                        )}
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
                  <td className="px-6 py-6">
                    <div
                      onClick={() =>
                        navigate(`/app/sessions?clientId=${client.id}`)
                      }
                      className="font-semibold text-sm text-indigo-400 cursor-pointer hover:underline"
                    >
                      {sessionTotal.toLocaleString("ru-RU")} сум
                    </div>

                    <div className="text-gray-400 text-xs mt-1">
                      {activeSession
                        ? "View session"
                        : "No activity"}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {activateClient && (
        <ActivatePackageDrawer
          client={activateClient}
          onClose={() =>
            setActivateClient(null)
          }
        />
      )}

      {paymentClient && (
        <PaymentModal
          total={getUnpaidTotalByClient(
            paymentClient.id
          )}
          onClose={() =>
            setPaymentClient(null)
          }
          onConfirm={() => {
            const unpaid =
              getUnpaidSessionsByClient(
                paymentClient.id
              )

            markSessionsPaid(
              unpaid.map((s) => s.id)
            )

            setPaymentClient(null)
          }}
        />
      )}

      {keyClient && (
        <KeypadModal
          mode="checkin"
          onClose={() =>
            setKeyClient(null)
          }
          onConfirm={(lockerCode) => {
            const activeSub =
              getActiveSubscriptionByClient(
                keyClient.id
              )

            if (!activeSub) return

            startSession({
              clientId: keyClient.id,
              clientName:
                keyClient.firstName +
                " " +
                keyClient.lastName,
              staffName: "Admin",
              lockerCode,
            })

            incrementVisit(activeSub.id)

            setKeyClient(null)
          }}
        />
      )}

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

            <div className="text-sm">
              Total:
              <span className="font-semibold ml-2">
                {closeData.session.totalAmount.toLocaleString(
                  "ru-RU"
                )}{" "}
                сум
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() =>
                  setCloseData(null)
                }
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  endSession(
                    closeData.session.id
                  )
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