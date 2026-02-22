import Chart from "react-apexcharts"
import { useMemo } from "react"

export default function Dashboard() {

    

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
  animations: { enabled: true },
  id: "revenue-chart"
},

    colors: ["#4F46E5"],

    stroke: {
      curve: "smooth",
      width: 3,
    },

    markers: {
      size: 4,
      colors: ["#4F46E5"],
      strokeWidth: 2,
      strokeColors: "#111827",
      hover: { size: 7 },
    },

    grid: {
      borderColor: "#1f2937",
    },

    xaxis: {
      categories: last30Days.map((d) =>
        d.date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "short",
        })
      ),
      tickAmount: 6,
      labels: {
        style: { colors: "#9CA3AF" },
      },
    },

    yaxis: {
      labels: {
        formatter: (val) =>
          val.toLocaleString("ru-RU") + " сум",
        style: { colors: "#9CA3AF" },
      },
    },

    tooltip: {
      theme: "dark",
      marker: { show: false },
      x: { show: false },
      y: {
        title: { formatter: () => "" },
        formatter: (val) =>
          val.toLocaleString("ru-RU") + " сум",
      },
    },

    theme: {
      mode: "dark",
    },
  }

  return (
    <div className="border border-white/10 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">
        Доход за последние 30 дней
      </h2>

      <Chart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  )
}