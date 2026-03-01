import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import RevenueChart from "../../modules/dashboard/ui/RevenueChart"

export default function Dashboard() {
  const navigate = useNavigate()

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

  return (
    <RevenueChart
      title="Доход за последние 30 дней"
      data={last30Days}
      onPointClick={(selected) => {
        const formatted = selected.date
          .toISOString()
          .split("T")[0]

        navigate(`/app/finance?date=${formatted}`)
      }}
    />
  )
}