import { createContext, useContext, useState } from "react"

const SessionsContext = createContext()

export function SessionsProvider({ children }) {
  const [sessions, setSessions] = useState([])

  /* ================= QUERIES ================= */

  const getSessionsByClient = (clientId) =>
    sessions.filter((s) => s.clientId === Number(clientId))

  const getActiveSessionByClient = (clientId) =>
    sessions.find(
      (s) =>
        s.clientId === Number(clientId) &&
        s.status === "active"
    )

  const getUnpaidSessionsByClient = (clientId) =>
    sessions.filter(
      (s) =>
        s.clientId === Number(clientId) &&
        !s.paid
    )

  const getUnpaidTotalByClient = (clientId) =>
    getUnpaidSessionsByClient(clientId).reduce(
      (sum, s) => sum + (s.amount || 0),
      0
    )

  /* ================= COMMANDS ================= */

  const startSession = ({
    clientId,
    lockerCode,
    keyCode,
    keyType = "manual",
    accessType = "package",
    amount = 0,
  }) => {
    // active session mavjudmi?
    const active = getActiveSessionByClient(clientId)
    if (active) return false

    const newSession = {
      id: Date.now(),
      clientId: Number(clientId),

      lockerCode,
      keyCode,
      keyType,

      accessType, // package | oneday
      amount,

      startedAt: new Date().toISOString(),
      endedAt: null,

      status: "active",
      paid: amount === 0, // package bo‘lsa true, oneday bo‘lsa false
      paymentId: null,
    }

    setSessions((prev) => [...prev, newSession])
    return true
  }

  const closeSessionByKey = (keyCode) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.keyCode === keyCode && s.status === "active"
          ? {
              ...s,
              status: "closed",
              endedAt: new Date().toISOString(),
            }
          : s
      )
    )
  }

  const markSessionsPaid = (sessionIds, paymentId) => {
    setSessions((prev) =>
      prev.map((s) =>
        sessionIds.includes(s.id)
          ? {
              ...s,
              paid: true,
              paymentId,
            }
          : s
      )
    )
  }

  return (
    <SessionsContext.Provider
      value={{
        sessions,

        /* queries */
        getSessionsByClient,
        getActiveSessionByClient,
        getUnpaidSessionsByClient,
        getUnpaidTotalByClient,

        /* commands */
        startSession,
        closeSessionByKey,
        markSessionsPaid,
      }}
    >
      {children}
    </SessionsContext.Provider>
  )
}

export function useSessionsContext() {
  return useContext(SessionsContext)
}