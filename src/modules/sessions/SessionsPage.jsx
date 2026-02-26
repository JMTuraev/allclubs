import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import InfoCards from "./ui/InfoCards"
import SessionsTable from "./ui/SessionsTable"
import { useSessions } from "./domain/useSessions"

export default function SessionsPage() {
  const { sessions } = useSessions()

  const [searchParams] = useSearchParams()
  const clientId = searchParams.get("clientId")

  const [expandedId, setExpandedId] = useState(null)

  /* ================= FILTER ================= */

  const filteredSessions = useMemo(() => {
    if (!clientId) return sessions

    return sessions.filter(
      s => s.clientId === Number(clientId)
    )
  }, [sessions, clientId])

  /* ================= AUTO EXPAND ================= */

  useEffect(() => {
    if (clientId && filteredSessions.length > 0) {
      setExpandedId(filteredSessions[0].id)
    }
  }, [clientId, filteredSessions])

  return (
    <div className="px-6 lg:px-8 space-y-8">
      <InfoCards />

      <SessionsTable
        sessions={filteredSessions}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />
    </div>
  )
}