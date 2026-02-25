import { createContext, useContext, useReducer } from "react"
import { v4 as uuid } from "uuid"

const SubscriptionsContext = createContext(null)

/* ================= REDUCER ================= */

function reducer(state, action) {
  switch (action.type) {

    case "ACTIVATE_SUBSCRIPTION":
      return [action.payload, ...state]

    case "EXPIRE_CLIENT_ACTIVE":
      return state.map(sub =>
        String(sub.clientId) === String(action.payload) &&
        sub.status === "active"
          ? { ...sub, status: "expired" }
          : sub
      )

    case "INCREMENT_VISIT":
      return state.map(sub => {
        if (sub.id !== action.payload) return sub

        const updatedVisits = sub.visitsUsed + 1

        // 🔥 visit tugasa avtomatik expired
        const newStatus =
          updatedVisits >= sub.visitsTotal
            ? "expired"
            : sub.status

        return {
          ...sub,
          visitsUsed: updatedVisits,
          status: newStatus,
        }
      })

    case "FORCE_EXPIRE":
      return state.map(sub =>
        sub.id === action.payload
          ? { ...sub, status: "expired" }
          : sub
      )

    default:
      return state
  }
}

/* ================= PROVIDER ================= */

export function SubscriptionsProvider({ children }) {
  const [subscriptions, dispatch] = useReducer(reducer, [])

  /* ================= ACTIVATE ================= */

  const activateSubscription = ({
    clientId,
    packageData,
    paymentId,
  }) => {

    const normalizedClientId = String(clientId)

    // 🔥 eski active subscription ni expire qilamiz
    dispatch({
      type: "EXPIRE_CLIENT_ACTIVE",
      payload: normalizedClientId,
    })

    const newSubscription = {
      id: uuid(),

      clientId: normalizedClientId,

      packageId: packageData.id,
      packageName: packageData.name,
      price: packageData.price,

      visitsTotal: packageData.visits,
      visitsUsed: 0,

      startedAt: new Date().toISOString(),
      expiresAt: null,

      status: "active",
      paymentId,
    }

    dispatch({
      type: "ACTIVATE_SUBSCRIPTION",
      payload: newSubscription,
    })

    return newSubscription
  }

  /* ================= VISIT ================= */

  const incrementVisit = (subscriptionId) => {
    dispatch({
      type: "INCREMENT_VISIT",
      payload: subscriptionId,
    })
  }

  /* ================= MANUAL EXPIRE ================= */

  const expireSubscription = (subscriptionId) => {
    dispatch({
      type: "FORCE_EXPIRE",
      payload: subscriptionId,
    })
  }

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,

        activateSubscription,
        incrementVisit,
        expireSubscription,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  )
}

/* ================= HOOK ================= */

export function useSubscriptionsContext() {
  const context = useContext(SubscriptionsContext)

  if (!context) {
    throw new Error(
      "useSubscriptionsContext must be used inside SubscriptionsProvider"
    )
  }

  return context
}