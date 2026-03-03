import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore"

import { db } from "../../../firebase"

const SubscriptionsContext = createContext(null)

/* ================= STATUS CALC ================= */

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
  const [loading, setLoading] = useState(true)

  // 🔥 vaqtincha hardcode (keyin authdan olamiz)
  const gymId = "sportzal_demo"

  /* ================= REALTIME LISTENER ================= */

  useEffect(() => {

    const q = query(
      collection(db, `gyms/${gymId}/subscriptions`),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))

        setSubscriptions(list)
        setLoading(false)
      },
      (error) => {
        console.error("Subscription listener error:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()

  }, [gymId])

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
    (clientId) =>
      subscriptionsWithStatus.find(
        sub =>
          String(sub.clientId) === String(clientId) &&
          sub.status === "active"
      )

  const getScheduledSubscriptionsByClient =
    (clientId) =>
      subscriptionsWithStatus.filter(
        sub =>
          String(sub.clientId) === String(clientId) &&
          sub.status === "scheduled"
      )

  const getSubscriptionsByClient =
    (clientId) =>
      subscriptionsWithStatus.filter(
        sub =>
          String(sub.clientId) === String(clientId)
      )

  const getSubscriptionById =
    (id) =>
      subscriptionsWithStatus.find(
        sub => sub.id === id
      )

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions: subscriptionsWithStatus,
        loading,
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
  const context = useContext(SubscriptionsContext)

  if (!context) {
    throw new Error(
      "useSubscriptionsContext must be used inside SubscriptionsProvider"
    )
  }

  return context
}