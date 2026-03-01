import { useParams } from "react-router-dom"
import { useMemo } from "react"

import { useClientsContext } from "../../modules/clients/domain/ClientsContext"
import { useSubscriptionsContext } from "../../modules/subscriptions/domain/SubscriptionsContext"
import { useTransactions } from "../../context/transaction/TransactionContext"
import { useSessionsContext } from "../../modules/sessions/domain/SessionsContext"

import ClientProfileLayout from "../../modules/clients/ui/profile/ClientProfileLayout"
import ClientHeader from "../../modules/clients/ui/profile/ClientHeader"
import ClientSubscriptionCard from "../../modules/clients/ui/profile/ClientSubscriptionCard"
import ClientCalendar from "../../modules/clients/ui/profile/ClientCalendar"
import ClientPersonalInfo from "../../modules/clients/ui/profile/ClientPersonalInfo"
import RevenueChart from "../../modules/dashboard/ui/RevenueChart"

export default function ClientProfilePage() {
  const { id } = useParams()

  const { getClientById } = useClientsContext()
  const {
    getActiveSubscriptionByClient,
    getSubscriptionsByClient,
  } = useSubscriptionsContext()

  const { sessions } = useSessionsContext()
  const { transactions, getClientBalance } = useTransactions()

  const client = getClientById(id)

  if (!client) {
    return (
      <div className="p-10 text-red-400">
        Client not found
      </div>
    )
  }

  /* ================= SUBSCRIPTIONS ================= */

  const activeSubscription =
    getActiveSubscriptionByClient(id)

  const allSubscriptions =
    getSubscriptionsByClient(id)

  const subscriptionHistory = allSubscriptions.filter(
    (s) => s.status !== "active"
  )

  /* ================= SESSIONS ================= */

  const clientSessions = useMemo(
    () =>
      sessions.filter(
        (s) => String(s.clientId) === String(id)
      ),
    [sessions, id]
  )

  /* ================= TRANSACTIONS ================= */

  const clientTransactions = useMemo(
    () =>
      transactions.filter(
        (t) =>
          String(t.clientId) === String(id) &&
          t.status === "active"
      ),
    [transactions, id]
  )

  const clientPayments = useMemo(
    () =>
      clientTransactions.filter(
        (t) => t.type === "payment"
      ),
    [clientTransactions]
  )

const revenueData = useMemo(() => {
  const days = []
  const today = new Date()

  // Oxirgi 30 kunni yaratamiz
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)

    const key = d.toISOString().split("T")[0]

    // Shu kunda paymentlar yig‘indisi
    const totalForDay = clientPayments
      .filter((t) => {
        const tDate = new Date(t.createdAt)
          .toISOString()
          .split("T")[0]
        return tDate === key
      })
      .reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      )

    days.push({
      date: new Date(d),
      value: totalForDay,
    })
  }

  return days
}, [clientPayments])
  const totalPaid = useMemo(
    () =>
      clientPayments.reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      ),
    [clientPayments]
  )

  const balance = getClientBalance(id)

  return (
    <ClientProfileLayout
      header={
        <ClientHeader
          client={client}
          subscription={activeSubscription}
          balance={balance}
          totalPaid={totalPaid}
        />
      }
      left={
        <>
          {/* ACTIVE SUBSCRIPTION */}
          <ClientSubscriptionCard
            subscription={activeSubscription}
          />

          {/* SUBSCRIPTION HISTORY */}
          {subscriptionHistory.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="text-sm text-gray-400">
                Subscription History
              </div>

              {subscriptionHistory.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-gray-800 p-4 rounded-xl text-sm"
                >
                  <div className="font-medium text-white">
                    {sub.packageSnapshot.name}
                  </div>

                  <div className="text-gray-400 text-xs mt-1">
                    Status: {sub.status}
                  </div>

                  {sub.replaceComment && (
                    <div className="text-red-400 text-xs mt-1">
                      Replace: {sub.replaceComment}
                    </div>
                  )}

                  {sub.correctionComment && (
                    <div className="text-yellow-400 text-xs mt-1">
                      Correction: {sub.correctionComment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* REUSABLE REVENUE CHART */}
          <RevenueChart
            title="Client Payments"
            data={revenueData}
            height={280}
          />
        </>
      }
      right={
        <>
          <ClientCalendar
            sessions={clientSessions}
          />
          <ClientPersonalInfo
            client={client}
          />
        </>
      }
    />
  )
}