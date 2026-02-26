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

        const updatedVisits = (sub.visitsUsed || 0) + 1

        const shouldExpire =
          sub.visitsTotal > 0 &&
          updatedVisits >= sub.visitsTotal

        return {
          ...sub,
          visitsUsed: updatedVisits,
          status: shouldExpire ? "expired" : sub.status,
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

    // 1️⃣ Eski active subscriptionni expire qilamiz
    dispatch({
      type: "EXPIRE_CLIENT_ACTIVE",
      payload: normalizedClientId,
    })

    const startDate = new Date()

    const expireDate = new Date()
    expireDate.setDate(
      expireDate.getDate() +
      Number(packageData?.duration || 0) +
      Number(packageData?.bonusDays || 0)
    )

    // 2️⃣ Snapshot yaratamiz (ENG MUHIM JOY)
    const newSubscription = {
      id: uuid(),

      clientId: normalizedClientId,

      // 🔥 PACKAGE SNAPSHOT (IMMUTABLE HISTORY)
      packageSnapshot: {
        id: packageData?.id ?? null,
        name: packageData?.name ?? "Unknown",
        price: Number(packageData?.price) || 0,
        duration: Number(packageData?.duration) || 0,
        bonusDays: Number(packageData?.bonusDays) || 0,
        isUnlimited: Boolean(packageData?.isUnlimited),
        visitLimit:
          packageData?.isUnlimited
            ? null
            : Number(packageData?.visitLimit) || 0,
        startTime: packageData?.startTime ?? null,
        endTime: packageData?.endTime ?? null,
        freezeEnabled: Boolean(packageData?.freezeEnabled),
        maxFreezeDays:
          Number(packageData?.maxFreezeDays) || 0,
        gender: packageData?.gender ?? "all",
      },

      // 🔥 VISIT LOGIC
      visitsTotal: packageData?.isUnlimited
        ? 999999
        : Number(packageData?.visitLimit) || 0,

      visitsUsed: 0,

      // 🔥 DATE LOGIC
      startedAt: startDate.toISOString(),
      expiresAt: expireDate.toISOString(),

      status: "active",

      paymentId: paymentId ?? null,
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

  /* ================= GETTERS ================= */

  const getActiveSubscriptionByClient = (clientId) => {
    return subscriptions.find(
      sub =>
        String(sub.clientId) === String(clientId) &&
        sub.status === "active"
    )
  }

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        activateSubscription,
        incrementVisit,
        expireSubscription,
        getActiveSubscriptionByClient,
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