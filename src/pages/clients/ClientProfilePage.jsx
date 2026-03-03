import { useParams } from "react-router-dom"
import { useMemo, useState, useEffect } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"

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
  const { getSubscriptionsByClient } =
    useSubscriptionsContext()

  const { sessions } = useSessionsContext()
  const { transactions, getClientBalance } =
    useTransactions()

  const client = getClientById(id)

  if (!client) {
    return (
      <div className="p-10 text-red-400">
        Client not found
      </div>
    )
  }

  /* ================= SUBSCRIPTIONS ================= */

  const allSubscriptions =
    getSubscriptionsByClient(id)

  // ✅ startDate ishlatamiz
  const sortedSubscriptions = useMemo(() => {
    return [...allSubscriptions].sort(
      (a, b) =>
        new Date(b.startDate) -
        new Date(a.startDate)
    )
  }, [allSubscriptions])

  const [currentIndex, setCurrentIndex] =
    useState(null)

  useEffect(() => {
    if (
      sortedSubscriptions.length &&
      currentIndex === null
    ) {
      setCurrentIndex(0)
    }
  }, [sortedSubscriptions, currentIndex])

  const selectedSubscription =
    currentIndex !== null
      ? sortedSubscriptions[currentIndex]
      : null

  /* ================= SESSIONS ================= */

  const clientSessions = useMemo(
    () =>
      sessions.filter(
        (s) =>
          String(s.clientId) ===
          String(id)
      ),
    [sessions, id]
  )

  // ✅ startDate / endDate ishlatamiz
  const filteredSessions =
    useMemo(() => {
      if (!selectedSubscription)
        return []

      const start = new Date(
        selectedSubscription.startDate
      )

      const end = new Date(
        selectedSubscription.endDate
      )

      return clientSessions.filter(
        (s) => {
          if (!s.startedAt) return false

          const d = new Date(
            s.startedAt
          )

          return (
            d >= start && d <= end
          )
        }
      )
    }, [
      clientSessions,
      selectedSubscription,
    ])

  /* ================= PAYMENTS ================= */

  const clientPayments = useMemo(
    () =>
      transactions.filter(
        (t) =>
          String(t.clientId) ===
            String(id) &&
          t.status === "active" &&
          t.type === "payment"
      ),
    [transactions, id]
  )

  const revenueData = useMemo(() => {
    const days = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)

      const key =
        d.toISOString().split("T")[0]

      const totalForDay =
        clientPayments
          .filter((t) => {
            const tDate =
              new Date(
                t.createdAt
              )
                .toISOString()
                .split("T")[0]
            return tDate === key
          })
          .reduce(
            (sum, t) =>
              sum +
              Number(t.amount || 0),
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
        (sum, t) =>
          sum +
          Number(t.amount || 0),
        0
      ),
    [clientPayments]
  )

  const balance = getClientBalance(id)

  /* ================= RENDER ================= */

  return (
    <ClientProfileLayout
      header={
        <ClientHeader
          client={client}
          subscription={
            selectedSubscription
          }
          balance={balance}
          totalPaid={totalPaid}
        />
      }
      left={
        <>
          <div className="relative">

            {currentIndex !== null &&
              currentIndex <
                sortedSubscriptions.length - 1 && (
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => prev + 1
                    )
                  }
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[#111827] p-2 rounded-full border border-white/10 hover:bg-indigo-600 transition"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
              )}

            {currentIndex !== null &&
              currentIndex > 0 && (
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => prev - 1
                    )
                  }
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#111827] p-2 rounded-full border border-white/10 hover:bg-indigo-600 transition"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              )}

            {selectedSubscription && (
              <ClientSubscriptionCard
                subscription={
                  selectedSubscription
                }
              />
            )}
          </div>

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
            sessions={filteredSessions}
            subscription={
              selectedSubscription
            }
          />
          <ClientPersonalInfo
            client={client}
          />
        </>
      }
    />
  )
}