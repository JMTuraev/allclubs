import {
  CubeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BoltIcon,
  XCircleIcon,
  FireIcon,
} from "@heroicons/react/24/outline"

export default function ClientSubscriptionCard({ client }) {
  const progress =
    ((30 - client.subscription.daysLeft) /
      client.subscription.totalDays) *
    100

  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
      {/* BU YERGA subscription card JSX 1:1 ko‘chiriladi */}
    </div>
  )
}