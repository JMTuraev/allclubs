import { createContext, useContext, useState, useMemo } from "react"

const SubscriptionsContext = createContext(null)

export function SubscriptionsProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([])

  /* ================= ACTIVATE ================= */

  const activateSubscription = (client, template) => {
    if (!client || !template) return

    const startedAt = new Date()
    const duration = Number(template.duration) || 30

    const expiresAt = new Date(startedAt)
    expiresAt.setDate(startedAt.getDate() + duration)

    const isUnlimited = Boolean(template.isUnlimited)

    const visits =
      isUnlimited
        ? null
        : Number(template.visitLimit) > 0
        ? Number(template.visitLimit)
        : 1

    const newSubscription = {
      id: crypto.randomUUID(),

      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`,
      clientPhone: client.phone ?? "",

      packageSnapshot: {
        id: template.id,
        name: template.name,
        duration,
        isUnlimited,
        visitsTotal: visits,
        price: template.price ?? 0,
      },

      visitsUsed: 0,
      visitsTotal: visits,

      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),

      status: "active",
      replaceComment: null,
    }

    setSubscriptions((prev) => [...prev, newSubscription])
  }

  /* ================= REPLACE ================= */

  const replaceSubscription = (oldId, comment) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== oldId) return sub

        return {
          ...sub,
          status: "replaced",
          expiresAt: new Date().toISOString(),
          replaceComment: comment || null,
        }
      })
    )
  }

  /* ================= VISIT ================= */

  const incrementVisit = (subscriptionId) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== subscriptionId) return sub
        if (sub.packageSnapshot?.isUnlimited) return sub

        return {
          ...sub,
          visitsUsed: sub.visitsUsed + 1,
        }
      })
    )
  }

  /* ================= DERIVED ================= */

  const subscriptionsWithStatus = useMemo(() => {
    const now = new Date()

    return subscriptions.map((sub) => {
      if (sub.status === "replaced") return sub

      const expireDate = new Date(sub.expiresAt)

      const isExpired =
        expireDate.getTime() < now.getTime() ||
        (!sub.packageSnapshot?.isUnlimited &&
          sub.visitsTotal !== null &&
          sub.visitsUsed >= sub.visitsTotal)

      return {
        ...sub,
        status: isExpired ? "expired" : "active",
      }
    })
  }, [subscriptions])

  const getActiveSubscriptionByClient = (clientId) => {
    return subscriptionsWithStatus.find(
      (sub) =>
        String(sub.clientId) === String(clientId) &&
        sub.status === "active"
    )
  }

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions: subscriptionsWithStatus,
        activateSubscription,
        replaceSubscription,
        incrementVisit,
        getActiveSubscriptionByClient,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  )
}

export function useSubscriptionsContext() {
  const context = useContext(SubscriptionsContext)
  if (!context)
    throw new Error(
      "useSubscriptionsContext must be used inside SubscriptionsProvider"
    )
  return context
}