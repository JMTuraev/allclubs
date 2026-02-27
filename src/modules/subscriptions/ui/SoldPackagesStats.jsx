export default function SoldPackagesStats({ data }) {
  const total = data.length

  const active = data.filter(sub => {
    return new Date(sub.expiresAt) > new Date()
  }).length

  const expired = total - active

  return (
    <div className="flex gap-4">
      <StatCard title="Total Sold" value={total} />
      <StatCard title="Active" value={active} />
      <StatCard title="Expired" value={expired} />
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800/70 border border-white/10 rounded-xl px-6 py-4">
      <div className="text-gray-400 text-xs">{title}</div>
      <div className="text-white text-xl font-semibold">
        {value}
      </div>
    </div>
  )
}