import { useState, useMemo } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

import { useClientsContext } from "../modules/clients/domain/ClientsContext"
import { useSessionsContext } from "../modules/sessions/domain/SessionsContext"
import { useSubscriptionsContext } from "../modules/subscriptions/domain/SubscriptionsContext"

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState(null)

  /* ================= CONTEXT DATA ================= */

  const { clients } = useClientsContext()
  const { sessions = [] } = useSessionsContext()
  const { subscriptions = [] } = useSubscriptionsContext()

  /* ================= ACTIVE SESSIONS ================= */

  const activeSessions = useMemo(() => {
    return sessions.filter((s) => !s.closedAt)
  }, [sessions])

  /* ================= SOLD SUBSCRIPTIONS (TOTAL) ================= */

  const totalSoldSubscriptions = useMemo(() => {
    return subscriptions.filter(
      (s) =>
        s.status !== "replaced" &&
        s.status !== "cancelled"
    )
  }, [subscriptions])

  /* ================= ACTIVE SUBSCRIPTIONS ================= */

  const activeSoldSubscriptions = useMemo(() => {
    return subscriptions.filter(
      (s) => s.status === "active"
    )
  }, [subscriptions])

  return (
    <div className="h-[100dvh] flex bg-gray-900 text-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        clients={clients}
        packages={totalSoldSubscriptions}          // 🔥 SOLD
        activeSessions={activeSessions}
        todayActivePackages={activeSoldSubscriptions} // 🔥 ACTIVE SOLD
      />

      <div className="flex-1 flex flex-col lg:pl-56 min-h-0">
        <Header
          setSidebarOpen={setSidebarOpen}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        <main className="flex-1 min-h-0 overflow-y-auto dark-scroll p-6">
          <Outlet context={{ dateFilter }} />
        </main>
      </div>
    </div>
  )
}