import { useMemo } from "react"
import { useSessionsContext } from "./SessionsContext"

export function useSessionSelectors() {
  const { sessions } = useSessionsContext()

  /* ================= BASIC ================= */

  const getSessionsByClient = (clientId) =>
    sessions.filter(
      s => s.clientId === clientId
    )

  const getActiveSessionByClient = (clientId) =>
    sessions.find(
      s =>
        s.clientId === clientId &&
        s.status === "active"
    )

  const getClosedSessionsByClient = (clientId) =>
    sessions.filter(
      s =>
        s.clientId === clientId &&
        s.status === "closed"
    )

  const getTotalByClient = (clientId) =>
    getSessionsByClient(clientId).reduce(
      (sum, s) => sum + (s.totalAmount || 0),
      0
    )

  /* ================= PAYMENT ================= */

  const getUnpaidSessionsByClient = (clientId) =>
    sessions.filter(
      s =>
        s.clientId === clientId &&
        s.status === "closed" &&
        !s.paid
    )

  const getUnpaidTotalByClient = (clientId) =>
    getUnpaidSessionsByClient(clientId)
      .reduce(
        (sum, s) => sum + (s.totalAmount || 0),
        0
      )

  /* ================= GLOBAL METRICS ================= */

  const totalActiveCount = useMemo(
    () =>
      sessions.filter(
        s => s.status === "active"
      ).length,
    [sessions]
  )

  const totalClosedCount = useMemo(
    () =>
      sessions.filter(
        s => s.status === "closed"
      ).length,
    [sessions]
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
  }
}