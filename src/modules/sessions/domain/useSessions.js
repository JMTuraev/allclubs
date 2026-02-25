import { useMemo } from "react"
import { useSessionsContext } from "./SessionsContext"

export function useSessions() {
  const { sessions } = useSessionsContext()

  const activeSessions = useMemo(
    () => sessions.filter(s => s.status === "active"),
    [sessions]
  )

  const closedSessions = useMemo(
    () => sessions.filter(s => s.status === "closed"),
    [sessions]
  )

  const totalRevenue = useMemo(
    () => sessions.reduce((sum, s) => sum + (s.totalAmount || 0), 0),
    [sessions]
  )

  return {
    sessions,
    activeSessions,
    closedSessions,
    totalRevenue
  }
}