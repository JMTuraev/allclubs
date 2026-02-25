import { useSubscriptionsContext } from "./SubscriptionsContext"

export function useSubscriptionSelectors() {
  const { subscriptions } = useSubscriptionsContext()

  const getActiveSubscriptionByClient = (clientId) =>
    subscriptions.find(
      s =>
        String(s.clientId) === String(clientId) &&
        s.status === "active"
    )

  const getSubscriptionsByClient = (clientId) =>
    subscriptions.filter(
      s =>
        String(s.clientId) === String(clientId)
    )

  return {
    getActiveSubscriptionByClient,
    getSubscriptionsByClient,
  }
}