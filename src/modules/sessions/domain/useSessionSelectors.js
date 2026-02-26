import { useMemo } from "react"
import { useSessionsContext } from "./SessionsContext"

export function useSessionSelectors() {
  const { sessions } = useSessionsContext()

  const activeSessions = useMemo(
    () => sessions.filter(s => s.status === "active"),
    [sessions]
  )

  const closedSessions = useMemo(
    () => sessions.filter(s => s.status === "closed"),
    [sessions]
  )

  const getSessionsByClient = (clientId) =>
    sessions.filter(s => s.clientId === clientId)

  const getActiveSessionByClient = (clientId) =>
    activeSessions.find(s => s.clientId === clientId)

  const getClosedSessionsByClient = (clientId) =>
    closedSessions.filter(s => s.clientId === clientId)

  const getTotalByClient = (clientId) =>
    getSessionsByClient(clientId)
      .reduce((sum, s) => sum + (s.totalAmount || 0), 0)

  const getUnpaidSessionsByClient = (clientId) =>
    closedSessions.filter(
      s => s.clientId === clientId && !s.paid
    )

  const getUnpaidTotalByClient = (clientId) =>
    getUnpaidSessionsByClient(clientId)
      .reduce((sum, s) => sum + (s.totalAmount || 0), 0)

  const totalActiveCount = activeSessions.length
  const totalClosedCount = closedSessions.length

  const totalRevenue = useMemo(
    () =>
      closedSessions.reduce(
        (sum, s) => sum + (s.totalAmount || 0),
        0
      ),
    [closedSessions]
  )

  return {
    getSessionsByClient,
    getActiveSessionByClient,
    getClosedSessionsByClient,
    getTotalByClient,
    getUnpaidSessionsByClient,
    getUnpaidTotalByClient,
    totalActiveCount,
    totalClosedCount,
    totalRevenue,
  }
}