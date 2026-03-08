import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import SessionsTable from "./ui/SessionsTable"
import ClientHeader from "../../modules/clients/ui/profile/ClientHeader"

import { useSessions } from "./domain/useSessions"
import { useClientsContext } from "../clients/domain/ClientsContext"

export default function SessionsPage() {

  const { sessions } = useSessions()
  const { clients } = useClientsContext()

  const [searchParams] = useSearchParams()
  const clientId = searchParams.get("clientId")

  const [expandedId, setExpandedId] = useState(null)

  /* ================= CLIENT ================= */

  const client = useMemo(() => {
    if (!clientId) return null

    return clients.find(
      c => String(c.id) === String(clientId)
    )
  }, [clients, clientId])

  /* ================= FILTER ================= */

  const filteredSessions = useMemo(() => {

    if (!clientId) return sessions

    return sessions.filter(
      s => String(s.clientId) === String(clientId)
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

      {client && (
        <ClientHeader client={client} />
      )}

      <SessionsTable
        sessions={filteredSessions}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />

    </div>
  )
}