import Chart from "react-apexcharts"
import { useMemo } from "react"

export default function RevenueChart({
  data = [],
  onPointClick,
  title = "Revenue",
  height = 250,
}) {
  /* ================= CLEAN DATA ================= */

  const cleanData = useMemo(() => {
    return data.map((d) => ({
      date: d?.date ? new Date(d.date) : new Date(),
      value: Number(d?.value) || 0,
    }))
  }, [data])

  /* ================= SERIES ================= */

  const series = useMemo(() => {
    return [
      {
        name: title,
        data: cleanData.map((d) => d.value),
      },
    ]
  }, [cleanData, title])

  /* ================= OPTIONS ================= */

  const options = useMemo(() => {
    return {
      chart: {
        type: "line",
        toolbar: { show: false },
        zoom: { enabled: false },
        background: "transparent",
        foreColor: "#9CA3AF",
        animations: { enabled: true },

        events: {
          click: function (event, chartContext, config) {
            const index = config?.dataPointIndex
            if (typeof index !== "number" || index < 0) return

            const selected = cleanData[index]
            if (!selected) return

            onPointClick?.(selected)
          },
        },
      },

      colors: ["#4F46E5"],

      stroke: {
        curve: "smooth",
        width: 3,
      },

      /* 🔥 Marker stabil variant */
      markers: {
        size: 5,
        strokeWidth: 2,
        strokeColors: "#111827",
        hover: {
          size: 7,
        },
      },

      grid: {
        borderColor: "#1f2937",
      },

      xaxis: {
        categories: cleanData.map((d) =>
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
            Number(val).toLocaleString("ru-RU") + " сум",
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
            Number(val).toLocaleString("ru-RU") + " сум",
        },
      },

      theme: {
        mode: "dark",
      },
    }
  }, [cleanData, onPointClick, title])

  /* ================= RENDER ================= */

  return (
    <div className="border border-white/10 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">
        {title}
      </h2>

      <Chart
        options={options}
        series={series}
        type="line"
        height={height}
      />
    </div>
  )
}