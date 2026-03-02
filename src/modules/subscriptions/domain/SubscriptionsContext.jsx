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

const endOfDay = (date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

const hasDateOverlap = (clientId, newStart, newEnd, list) => {
  return list.some(sub => {
    if (String(sub.clientId) !== String(clientId))
      return false

    if (sub.status === "replaced" || sub.status === "cancelled")
      return false

    const existingStart = new Date(sub.startDate)
    const existingEnd = new Date(sub.endDate)

    return (
      newStart <= existingEnd &&
      newEnd >= existingStart
    )
  })
}

const calculateStatus = (sub) => {
  const now = new Date()

  if (sub.status === "replaced") return "replaced"
  if (sub.status === "cancelled") return "cancelled"

  const start = new Date(sub.startDate)
  const end = new Date(sub.endDate)

  if (now < start) return "scheduled"
  if (now > end) return "expired"

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

    const activeSub = subscriptions.find(
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

    const rawEndDate = addDays(startDate, duration - 1)
    const endDate = endOfDay(rawEndDate)

    if (
      hasDateOverlap(
        client.id,
        startDate,
        endDate,
        subscriptions
      )
    ) {
      throw new Error("Subscription dates overlap")
    }

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

      status: "active",
      replaceComment: null,

      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    setSubscriptions(prev => [...prev, newSub])

    return newSub
  }

  /* ================= UPDATE START DATE (NEW) ================= */

  const updateStartDate = (subscriptionId, newStartDateRaw) => {
    const newStartDate = new Date(newStartDateRaw)

    setSubscriptions(prev => {
      const sub = prev.find(s => s.id === subscriptionId)
      if (!sub) return prev

      // 🔒 Session ochilgan bo‘lsa ruxsat yo‘q
      if (sub.sessionsCount > 0) {
        throw new Error(
          "Cannot edit start date after session started"
        )
      }

      const oldStart = new Date(sub.startDate)
      const oldEnd = new Date(sub.endDate)

      const duration =
        Math.floor(
          (oldEnd - oldStart) /
          (1000 * 60 * 60 * 24)
        ) + 1

      const newEndDate = endOfDay(
        addDays(newStartDate, duration - 1)
      )

      // 🔥 Overlap tekshiramiz (o‘zini hisobga olmaymiz)
      if (
        hasDateOverlap(
          sub.clientId,
          newStartDate,
          newEndDate,
          prev.filter(s => s.id !== subscriptionId)
        )
      ) {
        throw new Error(
          "New dates overlap another package"
        )
      }

      return prev.map(s =>
        s.id === subscriptionId
          ? {
              ...s,
              startDate: newStartDate.toISOString(),
              endDate: newEndDate.toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    })
  }

  /* ================= REPLACE ================= */

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

    let createdSub = null

    setSubscriptions(prev => {
      const oldSub = prev.find(
        s => s.id === oldSubscriptionId
      )

      if (!oldSub) return prev
      if (oldSub.sessionsCount > 0) return prev

      const updated = prev.map(sub =>
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

      const rawEndDate = addDays(now, duration - 1)
      const endDate = endOfDay(rawEndDate)

      if (
        hasDateOverlap(
          client.id,
          now,
          endDate,
          updated
        )
      ) {
        throw new Error("Subscription dates overlap")
      }

      const visitLimit =
        template.isUnlimited ? null : template.visitLimit ?? null

      createdSub = {
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

      return [...updated, createdSub]
    })

    return createdSub
  }

  /* ================= VISIT ================= */

  const decrementVisit = (subscriptionId) => {
    setSubscriptions(prev =>
      prev.map(sub => {
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
    setSubscriptions(prev =>
      prev.map(sub => {
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
      return subscriptions.map(sub => ({
        ...sub,
        status: calculateStatus(sub),
      }))
    }, [subscriptions])

  /* ================= SELECTORS ================= */

  const getActiveSubscriptionByClient =
    clientId =>
      subscriptionsWithStatus.find(
        sub =>
          String(sub.clientId) === String(clientId) &&
          sub.status === "active"
      )

  const getScheduledSubscriptionsByClient =
    clientId =>
      subscriptionsWithStatus.filter(
        sub =>
          String(sub.clientId) === String(clientId) &&
          sub.status === "scheduled"
      )

  const getSubscriptionsByClient =
    clientId =>
      subscriptionsWithStatus.filter(
        sub =>
          String(sub.clientId) === String(clientId)
      )

  const getSubscriptionById = id =>
    subscriptionsWithStatus.find(
      sub => sub.id === id
    )

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions: subscriptionsWithStatus,
        sellSubscription,
        replaceSubscription,
        updateStartDate, // ✅ NEW METHOD
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