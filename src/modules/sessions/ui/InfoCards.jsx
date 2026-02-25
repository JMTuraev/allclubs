import { useSessionStats } from "../domain/useSessionStats"

export default function InfoCards() {
  const { bar, packageRevenue, trainer } = useSessionStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Bar Revenue" value={bar} color="indigo" />
      <Card title="Package Revenue" value={packageRevenue} color="emerald" />
      <Card title="Trainer Revenue" value={trainer} color="purple" />
    </div>
  )
}

function Card({ title, value, color }) {
  const colors = {
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="text-sm text-gray-400">{title}</div>
      <div className={`mt-3 text-3xl font-bold ${colors[color]}`}>
        {value.toLocaleString()} so'm
      </div>
    </div>
  )
}