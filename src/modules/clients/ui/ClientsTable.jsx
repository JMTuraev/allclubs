import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useSessionSelectors } from "../../sessions/domain/useSessionSelectors"
import { useSubscriptionsContext } from "../../subscriptions/domain/SubscriptionsContext"

import { startSessionFn, endSessionFn } from "../../../firebase"

import KeypadModal from "../../../components/modals/KeypadModal"
import ActivatePackageDrawer from "../../subscriptions/ui/ActivatePackageDrawer"


export default function ClientsTable({ clients }) {

  const navigate = useNavigate()

  const { getActiveSessionByClient } = useSessionSelectors()

  const {
    getActiveSubscriptionByClient,
    getScheduledSubscriptionsByClient
  } = useSubscriptionsContext()

  const [keyClient, setKeyClient] = useState(null)
  const [activateClient, setActivateClient] = useState(null)
  const [closeData, setCloseData] = useState(null)
  const [processing, setProcessing] = useState(false)

  const GYM_ID = "sportzal_demo"

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

              const activeSub =
                getActiveSubscriptionByClient(client.id)

              const scheduledSubs =
                getScheduledSubscriptionsByClient(client.id)

              const hasActivePackage = !!activeSub
              const hasScheduledPackage =
                scheduledSubs.length > 0

              /* ================= PROGRESS ================= */

              let visitPercent = 0
              let visitsUsed = 0
              let visitsTotal = 0

              if (hasActivePackage) {

                const now = new Date()

                const startDate =
                  activeSub.startDate?.toDate
                    ? activeSub.startDate.toDate()
                    : new Date(activeSub.startDate)

                const expireDate =
                  activeSub.endDate?.toDate
                    ? activeSub.endDate.toDate()
                    : new Date(activeSub.endDate)

                const totalDays =
                  Math.max(
                    1,
                    Math.floor(
                      (expireDate - startDate) /
                        (1000 * 60 * 60 * 24)
                    ) + 1
                  )

                const usedDays =
                  now <= startDate
                    ? 0
                    : Math.floor(
                        (now - startDate) /
                          (1000 * 60 * 60 * 24)
                      )

                const daysPercent =
                  Math.min(
                    (usedDays / totalDays) * 100,
                    100
                  )

                if (activeSub.visitLimit == null) {

                  visitPercent = daysPercent

                } else {

                  visitsTotal =
                    activeSub.visitLimit

                  visitsUsed =
                    activeSub.visitLimit -
                    (activeSub.remainingVisits ?? 0)

                  const visitUsagePercent =
                    visitsTotal > 0
                      ? Math.min(
                          (visitsUsed /
                            visitsTotal) *
                            100,
                          100
                        )
                      : 0

                  visitPercent = Math.max(
                    visitUsagePercent,
                    daysPercent
                  )
                }
              }

              const canCheckIn =
                hasActivePackage &&
                (activeSub.visitLimit === null ||
                  activeSub.remainingVisits > 0)

              return (
                <tr
                  key={client.id}
                  className="hover:bg-gray-800/40 transition"
                >

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

               <div className="h-14 w-14 rounded-full border border-white/10 overflow-hidden bg-gray-800 flex items-center justify-center">

  {client.image ? (
    <img
      src={client.image}
      alt={client.firstName}
      className="h-full w-full object-cover"
      onError={(e) => {
        e.target.style.display = "none"
      }}
    />
  ) : null}

  {!client.image && (
    <span className="text-white text-sm font-semibold">
      {(client.firstName?.[0] || "")}
      {(client.lastName?.[0] || "")}
    </span>
  )}

</div>
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


                  {/* PACKAGE + PROGRESS */}

                  <td className="px-6 py-6">

                    {hasActivePackage ? (

                      <>

                        <div className="text-white">
                          {activeSub.packageSnapshot?.name}
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs">

                          {activeSub.visitLimit !== null && (
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
                              width: `${visitPercent}%`
                            }}
                          />

                        </div>

                      </>

                    ) : hasScheduledPackage ? (

                      <div className="text-yellow-400 text-xs space-y-1">

                        <div>
                          {scheduledSubs[0].packageSnapshot?.name}
                        </div>

                        <div>
                          Starts{" "}
                          {scheduledSubs[0].startDate?.toDate
                            ? scheduledSubs[0].startDate.toDate().toLocaleDateString()
                            : new Date(
                                scheduledSubs[0].startDate
                              ).toLocaleDateString()}
                        </div>

                      </div>

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

                      <div className="text-emerald-400 text-sm">
                        {activeSession.lockerCode}
                      </div>

                    ) : (

                      <span className="text-gray-500 text-xs">
                        —
                      </span>

                    )}

                  </td>


                  {/* ACTIVITY */}

                  <td className="px-6 py-6 text-sm">

                    {activeSession ? (

                      <button
                        onClick={() =>
                          setCloseData({
                            session: activeSession,
                            client
                          })
                        }
                        className="text-red-400 hover:underline"
                      >
                        Close
                      </button>

                    ) : canCheckIn ? (

                      <button
                        onClick={() =>
                          setKeyClient(client)
                        }
                        className="text-indigo-400 hover:underline"
                      >
                        Give Key
                      </button>

                    ) : (

                      <span className="text-gray-500">
                        —
                      </span>

                    )}

                  </td>

                </tr>
              )

            })}

          </tbody>

        </table>

      </div>


      {/* MODALS */}

      {activateClient && (
        <ActivatePackageDrawer
          client={activateClient}
          onClose={() => setActivateClient(null)}
        />
      )}

      {keyClient && (
        <KeypadModal
          mode="checkin"
          onClose={() => setKeyClient(null)}
          onConfirm={async (lockerCode) => {

            if (processing) return
            setProcessing(true)

            try {

              await startSessionFn({
                gymId: GYM_ID,
                clientId: keyClient.id,
                lockerCode
              })

              setKeyClient(null)

            } catch (err) {

              alert(err.message || "Session failed")

            } finally {

              setProcessing(false)

            }

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
        Client: {closeData.client.firstName} {closeData.client.lastName}
      </div>

      <div className="flex justify-end gap-3 pt-4">

        <button
          onClick={() => setCloseData(null)}
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={async () => {

            if (processing) return
            setProcessing(true)

            try {

              await endSessionFn({
                gymId: GYM_ID,
                sessionId: closeData.session.id
              })

              setCloseData(null)

            } catch (err) {

              alert(err.message || "Close failed")

            } finally {

              setProcessing(false)

            }

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