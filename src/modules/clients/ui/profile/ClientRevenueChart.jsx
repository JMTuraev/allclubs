import Chart from "react-apexcharts"
import { ChartBarIcon } from "@heroicons/react/24/outline"

export default function ClientRevenueChart({ data }) {
  const series = [
    {
      name: "Доход",
      data: data.map((d) => d.value),
    },
  ]

  const options = {
    chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false }, background: "transparent", foreColor: "#9CA3AF" },
    colors: ["#6366F1"],
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 3 },
    grid: { borderColor: "#1f2937" },
    xaxis: {
      categories: data.map((d) =>
        d.date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })
      ),
      tickAmount: 6,
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toLocaleString("ru-RU") + " сум",
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) => val.toLocaleString("ru-RU") + " сум",
      },
    },
    theme: { mode: "dark" },
  }

  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
      <h2 className="flex items-center gap-2 text-sm font-semibold mb-3">
        <ChartBarIcon className="w-4 h-4" />
        Доход за последние 30 дней
      </h2>
      <Chart options={options} series={series} type="line" height={220} />
    </div>
  )
}