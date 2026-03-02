import {
  createContext,
  useContext,
  useState,
  useMemo,
} from "react"

const SubscriptionsContext = createContext(null)

/* ================= HELPERS ================= */

const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const calculateStatus = (sub) => {
  const now = new Date()

  if (sub.status === "replaced") return "replaced"
  if (sub.status === "cancelled") return "cancelled"

  const start = new Date(sub.startDate)
  const end = new Date(sub.endDate)

  if (now < start) return "scheduled"

  if (
    now > end ||
    (sub.visitLimit !== null &&
      sub.remainingVisits !== null &&
      sub.remainingVisits <= 0)
  ) {
    return "expired"
  }

  return "active"
}

/* ================= PROVIDER ================= */

export function SubscriptionsProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([])

  /* ================= SELL ================= */

  const sellSubscription = (
    client,
    template,
    customStartDate = null
  ) => {
    if (!client || !template) return null

    const now = new Date()
    const newId = crypto.randomUUID()

    setSubscriptions((prev) => {

      const activeSub = prev.find(
        (s) =>
          String(s.clientId) === String(client.id) &&
          calculateStatus(s) === "active"
      )

      let startDate

      if (activeSub) {
        startDate = addDays(
          new Date(activeSub.endDate),
          1
        )
      } else {
        startDate = customStartDate
          ? new Date(customStartDate)
          : now
      }

      const duration =
        Number(template.duration || 0) +
        Number(template.bonusDays || 0)

      const endDate = addDays(startDate, duration)

      const visitLimit =
        template.isUnlimited ? null : template.visitLimit ?? null

      const newSub = {
        id: newId,
        clientId: String(client.id),
        clientName: `${client.firstName} ${client.lastName}`,
        clientPhone: client.phone ?? "",
        packageId: template.id,
        packageSnapshot: { ...template },
        soldAt: now.toISOString(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        visitLimit,
        remainingVisits: visitLimit,
        sessionsCount: 0,
        freezeUsedDays: 0,
        status:
          startDate > now
            ? "scheduled"
            : "active",
        replaceComment: null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }

      return [...prev, newSub]
    })

    return newId
  }

  /* ================= SAFE REPLACE ================= */

  const replaceSubscription = (
    oldSubscriptionId,
    client,
    template,
    comment
  ) => {
    if (!comment?.trim()) {
      throw new Error("Replace comment required")
    }

    const now = new Date()
    const newId = crypto.randomUUID()

    setSubscriptions((prev) => {
      const oldSub = prev.find(
        (s) => s.id === oldSubscriptionId
      )

      if (!oldSub) return prev

      if (oldSub.sessionsCount > 0) {
        alert("Cannot replace subscription after session started")
        return prev
      }

      const updated = prev.map((sub) =>
        sub.id === oldSubscriptionId
          ? {
              ...sub,
              status: "replaced",
              endDate: now.toISOString(),
              replaceComment: comment,
              updatedAt: now.toISOString(),
            }
          : sub
      )

      const duration =
        Number(template.duration || 0) +
        Number(template.bonusDays || 0)

      const endDate = addDays(now, duration)

      const visitLimit =
        template.isUnlimited ? null : template.visitLimit ?? null

      const newSub = {
        id: newId,
        clientId: String(client.id),
        clientName: `${client.firstName} ${client.lastName}`,
        clientPhone: client.phone ?? "",
        packageId: template.id,
        packageSnapshot: { ...template },
        soldAt: now.toISOString(),
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        visitLimit,
        remainingVisits: visitLimit,
        sessionsCount: 0,
        freezeUsedDays: 0,
        status: "active",
        replaceComment: null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }

      return [...updated, newSub]
    })

    return newId
  }

  /* ================= VISIT ================= */

  const decrementVisit = (subscriptionId) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== subscriptionId)
          return sub

        const currentStatus =
          calculateStatus(sub)

        if (currentStatus !== "active")
          return sub

        if (
          sub.visitLimit !== null &&
          sub.remainingVisits <= 0
        )
          return sub

        return {
          ...sub,
          remainingVisits:
            sub.visitLimit !== null
              ? sub.remainingVisits - 1
              : null,
          sessionsCount:
            sub.sessionsCount + 1,
          updatedAt:
            new Date().toISOString(),
        }
      })
    )
  }

  /* ================= CANCEL ================= */

  const cancelSubscription = (
    subscriptionId,
    reason = ""
  ) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== subscriptionId)
          return sub

        const currentStatus =
          calculateStatus(sub)

        if (currentStatus !== "scheduled")
          return sub

        return {
          ...sub,
          status: "cancelled",
          cancelReason: reason,
          updatedAt:
            new Date().toISOString(),
        }
      })
    )
  }

  /* ================= DERIVED ================= */

  const subscriptionsWithStatus =
    useMemo(() => {
      return subscriptions.map((sub) => ({
        ...sub,
        status: calculateStatus(sub),
      }))
    }, [subscriptions])

  /* ================= SELECTORS ================= */

  const getActiveSubscriptionByClient =
    (clientId) =>
      subscriptionsWithStatus.find(
        (sub) =>
          String(sub.clientId) === String(clientId) &&
          sub.status === "active"
      )

  const getScheduledSubscriptionsByClient =
    (clientId) =>
      subscriptionsWithStatus.filter(
        (sub) =>
          String(sub.clientId) === String(clientId) &&
          sub.status === "scheduled"
      )

  const getSubscriptionsByClient =
    (clientId) =>
      subscriptionsWithStatus.filter(
        (sub) =>
          String(sub.clientId) === String(clientId)
      )

  const getSubscriptionById = (id) =>
    subscriptionsWithStatus.find(
      (sub) => sub.id === id
    )

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions: subscriptionsWithStatus,
        sellSubscription,
        replaceSubscription,
        decrementVisit,
        cancelSubscription,
        getActiveSubscriptionByClient,
        getScheduledSubscriptionsByClient,
        getSubscriptionsByClient,
        getSubscriptionById,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  )
}

/* ================= HOOK ================= */

export function useSubscriptionsContext() {
  const context =
    useContext(SubscriptionsContext)

  if (!context) {
    throw new Error(
      "useSubscriptionsContext must be used inside SubscriptionsProvider"
    )
  }

  return context
}