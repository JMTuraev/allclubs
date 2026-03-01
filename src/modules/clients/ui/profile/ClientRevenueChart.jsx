import Chart from "react-apexcharts"
import { ChartBarIcon } from "@heroicons/react/24/outline"
import { useMemo } from "react"

export default function ClientRevenueChart({ payments = [] }) {
  const last30Days = useMemo(() => {
    const days = []
    const now = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)

      const dayTotal = payments
        .filter(
          (p) =>
            new Date(p.createdAt).toDateString() ===
            date.toDateString()
        )
        .reduce((sum, p) => sum + Number(p.amount || 0), 0)

      days.push({ date, value: dayTotal })
    }

    return days
  }, [payments])

  const series = [
    {
      name: "Доход",
      data: last30Days.map((d) => d.value),
    },
  ]

  const options = {
    chart: { type: "line", toolbar: { show: false } },
    colors: ["#6366F1"],
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: last30Days.map((d) =>
        d.date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "short",
        })
      ),
    },
    theme: { mode: "dark" },
  }

  return (
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
  )
}