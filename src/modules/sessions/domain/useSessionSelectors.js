import { useMemo } from "react"
import { useSessionsContext } from "./SessionsContext"

export function useSessionSelectors() {

  const { sessions } = useSessionsContext()

  /* ===============================
  SAFE SESSIONS
  =============================== */

  const safeSessions = sessions || []

  /* ===============================
  ACTIVE / CLOSED LISTS
  =============================== */

  const activeSessions = useMemo(
    () => safeSessions.filter((s) => s.status === "active"),
    [safeSessions]
  )

  const closedSessions = useMemo(
    () => safeSessions.filter((s) => s.status === "closed"),
    [safeSessions]
  )

  /* ===============================
  INDEXES (FAST LOOKUPS)
  =============================== */

  const sessionsByClient = useMemo(() => {

    const map = new Map()

    safeSessions.forEach((s) => {

      if (!map.has(s.clientId)) {
        map.set(s.clientId, [])
      }

      map.get(s.clientId).push(s)

    })

    return map

  }, [safeSessions])

  const activeSessionByClient = useMemo(() => {

    const map = new Map()

    activeSessions.forEach((s) => {
      map.set(s.clientId, s)
    })

    return map

  }, [activeSessions])

  const closedSessionsByClient = useMemo(() => {

    const map = new Map()

    closedSessions.forEach((s) => {

      if (!map.has(s.clientId)) {
        map.set(s.clientId, [])
      }

      map.get(s.clientId).push(s)

    })

    return map

  }, [closedSessions])

  /* ===============================
  SELECTORS
  =============================== */

  const getSessionsByClient = (clientId) =>
    sessionsByClient.get(clientId) || []

  const getActiveSessionByClient = (clientId) =>
    activeSessionByClient.get(clientId) || null

  const getClosedSessionsByClient = (clientId) =>
    closedSessionsByClient.get(clientId) || []

  const getTotalByClient = (clientId) =>
    (sessionsByClient.get(clientId) || []).reduce(
      (sum, s) => sum + (s.totalAmount || 0),
      0
    )

  const getUnpaidSessionsByClient = (clientId) =>
    (closedSessionsByClient.get(clientId) || []).filter(
      (s) => !s.paid
    )

  const getUnpaidTotalByClient = (clientId) =>
    getUnpaidSessionsByClient(clientId).reduce(
      (sum, s) => sum + (s.totalAmount || 0),
      0
    )

  /* ===============================
  GLOBAL STATS
  =============================== */

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
    totalRevenue
  }

}