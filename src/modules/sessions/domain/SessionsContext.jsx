import { createContext, useContext, useReducer, useMemo } from "react"
import { v4 as uuid } from "uuid"
import { useAudit } from "../../audit/AuditContext"
import { useSubscriptionsContext } from "../../subscriptions/domain/SubscriptionsContext"

const SessionsContext = createContext()

/* ================= HELPERS ================= */

function calculateDuration(startedAt) {
  const start = new Date(startedAt)
  const end = new Date()
  return Math.floor((end - start) / 60000)
}

/* ================= REDUCER ================= */

function reducer(state, action) {
  switch (action.type) {

    case "START_SESSION":
      return [action.payload, ...state]

    case "END_SESSION":
      return state.map(s =>
        s.id === action.payload
          ? {
              ...s,
              status: "closed",
              endedAt: new Date().toISOString(),
              durationMinutes: calculateDuration(s.startedAt),
            }
          : s
      )

    case "VOID_SESSION":
      return state.map(s =>
        s.id === action.payload.sessionId
          ? {
              ...s,
              status: "voided",
              voidReason: action.payload.reason,
              voidedBy: action.payload.staffName,
              voidedAt: new Date().toISOString(),
            }
          : s
      )

    case "MARK_PAID":
      return state.map(s =>
        action.payload.includes(s.id)
          ? { ...s, paid: true }
          : s
      )

    case "ADD_TRANSACTION":
      return state.map(s =>
        s.id === action.payload.sessionId
          ? {
              ...s,
              transactions: [...s.transactions, action.payload.tx],
              totalAmount:
                (s.totalAmount || 0) +
                action.payload.tx.amount
            }
          : s
      )

    default:
      return state
  }
}

/* ================= PROVIDER ================= */

export function SessionsProvider({ children }) {
  const [sessions, dispatch] = useReducer(reducer, [])
  const { addEvent } = useAudit()

  const {
    getActiveSubscriptionByClient,
    decrementVisit,
    incrementVisit
  } = useSubscriptionsContext()

  /* ================= START SESSION ================= */

  const startSession = ({
    clientId,
    clientName,
    staffName,
    lockerCode,
  }) => {

    // 1️⃣ Active session protection
    const existingActive = sessions.find(
      s =>
        String(s.clientId) === String(clientId) &&
        s.status === "active"
    )

    if (existingActive) {
      throw new Error("Client already has active session")
    }

    // 2️⃣ Active subscription check
    const subscription =
      getActiveSubscriptionByClient(clientId)

    if (!subscription || subscription.status !== "active") {
      throw new Error("No active subscription")
    }

    // 3️⃣ Visit check (only if NOT unlimited)
    if (
      subscription.visitLimit !== null &&
      subscription.remainingVisits <= 0
    ) {
      throw new Error("No remaining visits")
    }

    // 4️⃣ Decrement visit (only limited packages)
    if (subscription.visitLimit !== null) {
      decrementVisit(subscription.id)
    }

    const newSession = {
      id: uuid(),
      clientId,
      clientName,
      staffName,
      lockerCode,

      subscriptionId: subscription.id,

      startedAt: new Date().toISOString(),
      endedAt: null,

      status: "active",
      paid: false,

      transactions: [],
      totalAmount: 0,
      durationMinutes: 0,

      voidReason: null,
      voidedBy: null,
      voidedAt: null,
    }

    dispatch({ type: "START_SESSION", payload: newSession })

    addEvent({
      type: "SESSION_OPENED",
      sessionId: newSession.id,
      clientName,
      subscriptionId: subscription.id
    })

    return newSession
  }

  /* ================= END SESSION ================= */

  const endSession = (id) => {
    dispatch({ type: "END_SESSION", payload: id })

    addEvent({
      type: "SESSION_CLOSED",
      sessionId: id
    })
  }

  /* ================= VOID SESSION ================= */

  const voidSession = ({
    sessionId,
    reason,
    staffName
  }) => {

    const session = sessions.find(
      s => s.id === sessionId
    )

    if (!session) return
    if (session.status === "voided") return

    // 🔁 Return visit only if limited
    if (session.subscriptionId) {
      incrementVisit(session.subscriptionId)
    }

    dispatch({
      type: "VOID_SESSION",
      payload: {
        sessionId,
        reason,
        staffName
      }
    })

    addEvent({
      type: "SESSION_VOIDED",
      sessionId,
      subscriptionId: session.subscriptionId,
      reason,
      staffName
    })
  }

  /* ================= OTHER ================= */

  const markSessionsPaid = (ids) => {
    dispatch({ type: "MARK_PAID", payload: ids })
  }

  const addTransaction = (sessionId, tx) => {
    const newTx = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      ...tx,
    }

    dispatch({
      type: "ADD_TRANSACTION",
      payload: { sessionId, tx: newTx }
    })

    addEvent({
      type: "TRANSACTION_ADDED",
      sessionId,
      amount: tx.amount
    })
  }

  const value = useMemo(() => ({
    sessions,
    startSession,
    endSession,
    voidSession,
    addTransaction,
    markSessionsPaid
  }), [sessions])

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  )
}

/* ================= HOOK ================= */

export function useSessionsContext() {
  const ctx = useContext(SessionsContext)
  if (!ctx) {
    throw new Error("useSessionsContext must be used inside SessionsProvider")
  }
  return ctx
}