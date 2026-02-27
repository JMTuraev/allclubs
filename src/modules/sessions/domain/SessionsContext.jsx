import { createContext, useContext, useReducer, useMemo } from "react"
import { v4 as uuid } from "uuid"
import { useAudit } from "../../audit/AuditContext"

const SessionsContext = createContext()

function calculateDuration(startedAt) {
  const start = new Date(startedAt)
  const end = new Date()
  return Math.floor((end - start) / 60000)
}

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

export function SessionsProvider({ children }) {
  const [sessions, dispatch] = useReducer(reducer, [])
  const { addEvent } = useAudit() // 🔥 audit ulash

  const startSession = ({
    clientId,
    clientName,
    staffName,
    lockerCode,
  }) => {
    const newSession = {
      id: uuid(),
      clientId,
      clientName,
      staffName,
      lockerCode,

      startedAt: new Date().toISOString(),
      endedAt: null,

      status: "active",
      paid: false,

      transactions: [],
      totalAmount: 0,
      durationMinutes: 0,
    }

    dispatch({ type: "START_SESSION", payload: newSession })

    // 🔥 AUDIT YOZISH
    addEvent({
      type: "SESSION_OPENED",
      sessionId: newSession.id,
      clientName
    })

    return newSession
  }

  const endSession = (id) => {
    dispatch({ type: "END_SESSION", payload: id })

    // 🔥 AUDIT YOZISH
    addEvent({
      type: "SESSION_CLOSED",
      sessionId: id
    })
  }

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

    // 🔥 optional audit
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
    addTransaction,
    markSessionsPaid
  }), [sessions])

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  )
}

export function useSessionsContext() {
  const ctx = useContext(SessionsContext)
  if (!ctx) {
    throw new Error("useSessionsContext must be used inside SessionsProvider")
  }
  return ctx
}