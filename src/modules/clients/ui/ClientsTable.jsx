import { useState } from "react"
import { KeyIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"
import { useSessionsContext } from "../../sessions/domain/SessionsContext"

import PaymentModal from "../../../components/modals/PaymentModal"
import KeypadModal from "../../../components/modals/KeypadModal"
import ActivatePackageDrawer from "../../subscriptions/ui/ActivatePackageDrawer"

export default function ClientsTable({ clients }) {
  const navigate = useNavigate()

  const {
    getActiveSessionByClient,
    getUnpaidTotalByClient,
    getUnpaidSessionsByClient,
    markSessionsPaid,
  } = useSessionsContext()

  const [paymentClient, setPaymentClient] = useState(null)
  const [keyClient, setKeyClient] = useState(null)
  const [activateClient, setActivateClient] = useState(null)

  // 🔥 NEW — subscription payment state
  const [subscriptionPayment, setSubscriptionPayment] = useState(null)

  return (
    <>
      <div className="bg-gray-900 border border-white/10 rounded-2xl">
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
              const activeSession = getActiveSessionByClient(client.id)
              const unpaidTotal = getUnpaidTotalByClient(client.id)

              const hasPackage = !!client.package
              const visitsUsed = client.package?.visitsUsed ?? 0
              const visitsTotal = client.package?.visitsTotal ?? 0

              const visitPercent =
                visitsTotal > 0
                  ? (visitsUsed / visitsTotal) * 100
                  : 0

              return (
                <tr key={client.id} className="hover:bg-gray-800/40 transition">

                  {/* NUMBER */}
                  <td className="px-6 py-6 text-gray-400">
                    {index + 1}
                  </td>

                  {/* CLIENT */}
                  <td className="px-6 py-6">
                    <div
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => navigate(`/clients/${client.id}`)}
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
                          {client.package.name}
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
                            style={{ width: `${visitPercent}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => setActivateClient(client)}
                        className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                      >
                        Activate Package
                      </button>
                    )}
                  </td>

                  {/* LOCKER */}
                  <td className="px-6 py-6">
                    {activeSession ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <KeyIcon className="h-5 w-5" />
                        {activeSession.lockerCode}
                      </div>
                    ) : (
                      <button
                        onClick={() => setKeyClient(client)}
                        className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                      >
                        Give Key
                      </button>
                    )}
                  </td>

                  {/* ACTIVITY */}
                  <td className="px-6 py-6">
                    <div
                      onClick={() =>
                        unpaidTotal > 0 && setPaymentClient(client)
                      }
                      className={`font-semibold text-sm ${
                        unpaidTotal > 0
                          ? "text-green-400 cursor-pointer hover:underline"
                          : "text-gray-400"
                      }`}
                    >
                      {unpaidTotal.toLocaleString("ru-RU")} сум
                    </div>

                    <div className="text-gray-400 text-xs mt-1">
                      {unpaidTotal > 0
                        ? "Click to pay"
                        : activeSession
                        ? "Active"
                        : "No activity"}
                    </div>
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
          onConfirm={(selectedPackage) => {
            setActivateClient(null)

            setSubscriptionPayment({
              client: activateClient,
              package: selectedPackage,
            })
          }}
        />
      )}

      {/* SUBSCRIPTION PAYMENT */}
      {subscriptionPayment && (
        <PaymentModal
          total={subscriptionPayment.package.price}
          onClose={() => setSubscriptionPayment(null)}
          onConfirm={(method) => {
            console.log("Paid with:", method)

            // TODO: bu yerda client.package biriktiramiz
            // keyingi bosqich

            setSubscriptionPayment(null)
          }}
        />
      )}

      {/* SESSION PAYMENT */}
      {paymentClient && (
        <PaymentModal
          total={getUnpaidTotalByClient(paymentClient.id)}
          onClose={() => setPaymentClient(null)}
          onConfirm={() => {
            const unpaid =
              getUnpaidSessionsByClient(paymentClient.id)

            markSessionsPaid(
              unpaid.map((s) => s.id),
              Date.now()
            )

            setPaymentClient(null)
          }}
        />
      )}

      {/* KEY MODAL */}
      {keyClient && (
        <KeypadModal
          mode="checkin"
          onClose={() => setKeyClient(null)}
          onConfirm={() => setKeyClient(null)}
        />
      )}
    </>
  )
}