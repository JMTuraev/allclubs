import { useMemo } from "react"
import ClientHeader from "./ClientHeader"
import ClientSubscriptionCard from "./ClientSubscriptionCard"
import ClientRevenueChart from "./ClientRevenueChart"
import ClientCalendar from "./ClientCaelendar"
import ClientPersonalInfo from "./ClientPersonalInfo"

export default function ClientProfileLayout() {
  const client = {
    name: "Lindsay Walton",
    phone: "+998 90 123 45 67",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&q=80",
    subscription: {
      plan: "Platinum",
      expires: "May 5, 2024",
      daysLeft: 22,
      totalDays: 30,
      lifetimeSpent: 1250000,
      totalVisits: 142,
      missedSessions: 3,
      longestStreak: "4 months",
      packagesUsed: [
        { name: "Daily Pass", count: 60 },
        { name: "Monthly Gold", count: 4 },
        { name: "Unlimited Pro", count: 1 },
      ],
    },
  }

  const last30Days = useMemo(() => {
    const days = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      days.push({
        date: new Date(d),
        value: Math.floor(1000000 + Math.random() * 1500000),
      })
    }
    return days
  }, [])

  const attendedDays = [2, 4, 6, 11]
  const missedDays = [3, 8, 13]

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">

        <ClientHeader client={client} />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 flex flex-col gap-4">
            <ClientSubscriptionCard client={client} />
            <ClientRevenueChart data={last30Days} />
          </div>

          <div className="col-span-4 flex flex-col gap-4">
            <ClientCalendar
              attendedDays={attendedDays}
              missedDays={missedDays}
            />
            <ClientPersonalInfo client={client} />
          </div>
        </div>

      </div>
    </div>
  )
}