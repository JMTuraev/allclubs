import Chart from "react-apexcharts"
import { useEffect, useMemo, useState } from "react"

import {
  collection,
  query,
  onSnapshot
} from "firebase/firestore"

import { db } from "../../../firebase"

const gymId = "sportzal_demo"

export default function RevenueCostChart() {

  const [dataset, setDataset] = useState([])

  /* ================= LOAD DATA ================= */

  useEffect(() => {

    const checksRef = collection(db, `gyms/${gymId}/barChecks`)
    const incomingRef = collection(db, `gyms/${gymId}/barIncoming`)

    const revenueMap = {}
    const costMap = {}

    const unsubChecks = onSnapshot(checksRef, (snap) => {

      snap.docs.forEach(doc => {

        const data = doc.data()

        if (!data.createdAt) return

        const date = data.createdAt
          .toDate()
          .toISOString()
          .slice(0, 10)

        revenueMap[date] =
          (revenueMap[date] || 0) + (data.total || 0)

      })

      buildDataset()

    })

    const unsubIncoming = onSnapshot(incomingRef, (snap) => {

      snap.docs.forEach(doc => {

        const data = doc.data()

        if (!data.createdAt) return

        const date = data.createdAt
          .toDate()
          .toISOString()
          .slice(0, 10)

        costMap[date] =
          (costMap[date] || 0) + (data.total || 0)

      })

      buildDataset()

    })

    function buildDataset() {

      const dates = new Set([
        ...Object.keys(revenueMap),
        ...Object.keys(costMap)
      ])

      const result = Array.from(dates)
        .sort()
        .map(date => ({
          date,
          revenue: revenueMap[date] || 0,
          cost: costMap[date] || 0
        }))

      setDataset(result)

    }

    return () => {
      unsubChecks()
      unsubIncoming()
    }

  }, [])

  /* ================= SERIES ================= */

  const series = useMemo(() => {

    return [
      {
        name: "Revenue",
        data: dataset.map(d => d.revenue)
      },
      {
        name: "Cost",
        data: dataset.map(d => d.cost)
      }
    ]

  }, [dataset])

  /* ================= X AXIS ================= */

  const categories = useMemo(() => {

    return dataset.map(d =>
      new Date(d.date).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "short"
      })
    )

  }, [dataset])

  /* ================= OPTIONS ================= */

  const options = {

    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      foreColor: "#9CA3AF"
    },

    colors: [
      "#6366F1",
      "#F59E0B"
    ],

    stroke: {
      curve: "smooth",
      width: 3
    },

    markers: {
      size: 4,
      strokeWidth: 2,
      strokeColors: "#0B1120"
    },

    grid: {
      borderColor: "#1f2937"
    },

    xaxis: {
      categories,
      tickAmount: Math.ceil(categories.length / 5),

      labels: {
        style: { colors: "#9CA3AF" }
      }
    },

    yaxis: {
      labels: {
        formatter: val =>
          Number(val).toLocaleString("ru-RU") + " сум"
      }
    },

    tooltip: {
      theme: "dark",

      y: {
        formatter: val =>
          Number(val).toLocaleString("ru-RU") + " сум"
      }
    },

    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#9CA3AF" }
    }

  }

  /* ================= RENDER ================= */

  return (

    <div className="bg-[#0F172A] rounded-2xl border border-white/10 p-6">

      <div className="text-sm text-gray-400 mb-4">
        Revenue vs Cost
      </div>

      <Chart
        options={options}
        series={series}
        type="line"
        height={160}
      />

    </div>

  )

}