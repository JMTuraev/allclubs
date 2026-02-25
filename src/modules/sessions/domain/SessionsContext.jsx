import { createContext, useContext, useReducer, useMemo } from "react"
import { v4 as uuid } from "uuid"

const SessionsContext = createContext()

/* ================= REDUCER ================= */

function reducer(state, action) {
  switch (action.type) {
    case "START_SESSION":
      return [action.payload, ...state]

    case "END_SESSION":
      return state.map(s =>
        s.id === action.payload
          ? { ...s, status: "closed", endedAt: new Date().toISOString() }
          : s
      )

    case "ADD_TRANSACTION":
      return state.map(s =>
        s.id === action.payload.sessionId
          ? {
              ...s,
              transactions: [...s.transactions, action.payload.tx],
              totalAmount:
                (s.totalAmount || 0) + action.payload.tx.amount
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

  /* COMMANDS */

  const startSession = ({ clientId, clientName, staffName }) => {
    const newSession = {
      id: uuid(),
      clientId,
      clientName,
      staffName,

      startedAt: new Date().toISOString(),
      endedAt: null,

      status: "active",
      transactions: [],
      totalAmount: 0,
    }

    dispatch({ type: "START_SESSION", payload: newSession })
    return newSession
  }

  const endSession = (id) => {
    dispatch({ type: "END_SESSION", payload: id })
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
  }

  const value = useMemo(() => ({
    sessions,
    startSession,
    endSession,
    addTransaction
  }), [sessions])

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  )
}

export function useSessionsContext() {
  return useContext(SessionsContext)
}