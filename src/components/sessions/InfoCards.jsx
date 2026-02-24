export default function InfoCards({ sessions }) {

  const bar = sessions.reduce(
    (sum, s) =>
      sum +
      (s.transactions || [])
        .filter((tx) => tx.type === "bar")
        .reduce((t, i) => t + i.amount, 0),
    0
  )

  const packageRevenue = sessions.reduce(
    (sum, s) =>
      sum +
      (s.transactions || [])
        .filter((tx) => tx.type === "package")
        .reduce((t, i) => t + i.amount, 0),
    0
  )

  const trainer = sessions.reduce(
    (sum, s) =>
      sum +
      (s.transactions || [])
        .filter((tx) => tx.type === "trainer")
        .reduce((t, i) => t + i.amount, 0),
    0
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card
        title="Bar Revenue"
        value={bar}
        color="indigo"
        icon={<BarIcon />}
      />
      <Card
        title="Package Revenue"
        value={packageRevenue}
        color="emerald"
        icon={<PackageIcon />}
      />
      <Card
        title="Trainer Revenue"
        value={trainer}
        color="purple"
        icon={<TrainerIcon />}
      />
    </div>
  )
}

/* ================= CARD ================= */

function Card({ title, value, color, icon }) {
  const colorMap = {
    indigo: {
      text: "text-indigo-400",
      bg: "from-indigo-600/10 to-indigo-800/5",
      glow: "group-hover:shadow-indigo-500/20",
    },
    emerald: {
      text: "text-emerald-400",
      bg: "from-emerald-600/10 to-emerald-800/5",
      glow: "group-hover:shadow-emerald-500/20",
    },
    purple: {
      text: "text-purple-400",
      bg: "from-purple-600/10 to-purple-800/5",
      glow: "group-hover:shadow-purple-500/20",
    },
  }

  const theme = colorMap[color]

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900 p-6 transition group hover:shadow-lg ${theme.glow}`}>

      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`} />

      <div className="absolute right-6 top-6 opacity-20 group-hover:opacity-30 transition">
        {icon}
      </div>

      <div className="relative z-10">
        <div className="text-sm text-gray-400">
          {title}
        </div>

        <div className={`mt-3 text-3xl font-semibold ${theme.text}`}>
          {value.toLocaleString()} so'm
        </div>
      </div>
    </div>
  )
}

/* ================= ICONS ================= */

function BarIcon() {
  return (
    <svg
      className="w-14 h-14 text-indigo-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <rect x="4" y="10" width="3" height="8" />
      <rect x="10" y="6" width="3" height="12" />
      <rect x="16" y="3" width="3" height="15" />
    </svg>
  )
}

function PackageIcon() {
  return (
    <svg
      className="w-14 h-14 text-emerald-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M3 7L12 2L21 7V17L12 22L3 17V7Z" />
      <path d="M12 2V12L21 7" />
    </svg>
  )
}

function TrainerIcon() {
  return (
    <svg
      className="w-14 h-14 text-purple-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="5" r="3" />
      <path d="M9 22V14H15V22" />
      <path d="M12 8V14" />
    </svg>
  )
}