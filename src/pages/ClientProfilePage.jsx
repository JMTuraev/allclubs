import { useMemo } from "react"
import Chart from "react-apexcharts"
import {
  UserIcon,
  PhoneIcon,
  CalendarDaysIcon,
  CubeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BoltIcon,
  XCircleIcon,
  FireIcon,
  ChartBarIcon,
  IdentificationIcon,
  UserCircleIcon,
  CalendarIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function ClientProfilePage() {
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

  const series = [
    {
      name: "Доход",
      data: last30Days.map((d) => d.value),
    },
  ]

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      foreColor: "#9CA3AF",
    },
    colors: ["#6366F1"],
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 3 },
    grid: { borderColor: "#1f2937" },
    xaxis: {
      categories: last30Days.map((d) =>
        d.date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "short",
        })
      ),
      tickAmount: 6,
    },
    yaxis: {
      labels: {
        formatter: (val) =>
          val.toLocaleString("ru-RU") + " сум",
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) =>
          val.toLocaleString("ru-RU") + " сум",
      },
    },
    theme: { mode: "dark" },
  }

  const attendedDays = [2, 4, 6, 11]
  const missedDays = [3, 8, 13]
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1)

  const progress =
    ((30 - client.subscription.daysLeft) /
      client.subscription.totalDays) *
    100

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={client.avatar}
              className="w-14 h-14 rounded-full border-2 border-white/20"
            />
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <UserIcon className="w-4 h-4" />
                {client.name}
              </div>
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <PhoneIcon className="w-4 h-4" />
                {client.phone}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 text-xs opacity-80 justify-end">
              <CalendarDaysIcon className="w-4 h-4" />
              Expires
            </div>
            <div className="text-sm font-semibold">
              {client.subscription.expires}
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-4">

          {/* LEFT */}
          <div className="col-span-8 flex flex-col gap-4">

            {/* SUBSCRIPTION */}
            <div className="bg-[#111827] rounded-xl p-4 border border-white/5">

              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CubeIcon className="w-4 h-4" />
                  {client.subscription.plan}
                </div>
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <ClockIcon className="w-4 h-4" />
                  {client.subscription.daysLeft} days left
                </div>
              </div>

              <div className="h-1.5 bg-gray-800 rounded-full mb-4">
                <div
                  className="h-1.5 bg-indigo-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* KPI */}
              <div className="grid grid-cols-4 text-xs mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    Lifetime
                  </div>
                  <div className="font-medium">
                    {client.subscription.lifetimeSpent.toLocaleString("ru-RU")} сум
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <BoltIcon className="w-4 h-4" />
                    Visits
                  </div>
                  <div className="font-medium">
                    {client.subscription.totalVisits}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <XCircleIcon className="w-4 h-4" />
                    Missed
                  </div>
                  <div className="font-medium text-red-400">
                    {client.subscription.missedSessions}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <FireIcon className="w-4 h-4" />
                    Streak
                  </div>
                  <div className="font-medium">
                    {client.subscription.longestStreak}
                  </div>
                </div>
              </div>

              {/* PACKAGES USED — YONMA YON */}
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center gap-2 text-xs font-semibold mb-3">
                  <CubeIcon className="w-4 h-4" />
                  Packages Used
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {client.subscription.packagesUsed.map((pkg, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-3 text-center"
                    >
                      <CubeIcon className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
                      <div className="text-sm font-semibold">
                        {pkg.name}
                      </div>
                      <div className="text-indigo-400 font-bold text-lg">
                        {pkg.count}x
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* CHART */}
            <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
              <h2 className="flex items-center gap-2 text-sm font-semibold mb-3">
                <ChartBarIcon className="w-4 h-4" />
                Доход за последние 30 дней
              </h2>
              <Chart
                options={options}
                series={series}
                type="line"
                height={220}
              />
            </div>

          </div>

          {/* RIGHT */}
          <div className="col-span-4 flex flex-col gap-4">

            {/* CALENDAR */}
            <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                <CalendarIcon className="w-4 h-4" />
                April 2024
              </div>

              <div className="grid grid-cols-7 text-[10px] text-gray-400 mb-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day) => {
                  const attended = attendedDays.includes(day)
                  const missed = missedDays.includes(day)

                  return (
                    <div
                      key={day}
                      className={classNames(
                        "h-6 flex items-center justify-center rounded-md text-[11px]",
                        attended && "bg-green-600/80",
                        missed && "bg-red-600/80",
                        !attended && !missed && "bg-gray-800"
                      )}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* PERSONAL INFO */}
            <div className="bg-[#111827] rounded-xl p-4 border border-white/5 text-xs space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <IdentificationIcon className="w-4 h-4" />
                Personal Info
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <UserCircleIcon className="w-4 h-4" />
                  Age
                </span>
                <span>27</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  Gender
                </span>
                <span>Female</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  Joined
                </span>
                <span>Oct 15, 2021</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-1">
                  <LockClosedIcon className="w-4 h-4" />
                  Locker
                </span>
                <span>A12</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}