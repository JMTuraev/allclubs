import { CalendarIcon } from "@heroicons/react/24/outline"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function ClientCalendar({ sessions = [] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // ✅ Faqat joriy oy sessionlarini olish
  const sessionMap = sessions.reduce((acc, session) => {
    const date = new Date(session.date)

    if (
      date.getFullYear() === year &&
      date.getMonth() === month
    ) {
      const day = date.getDate()
      acc[day] = session.status
    }

    return acc
  }, {})

  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
      <div className="flex items-center gap-2 text-sm font-semibold mb-3">
        <CalendarIcon className="w-4 h-4" />
        {today.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </div>

      <div className="grid grid-cols-7 text-[10px] text-gray-400 mb-2">
        {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const status = sessionMap[day]
          const isToday = day === today.getDate()

          return (
            <div
              key={day}
              className={classNames(
                "h-6 flex items-center justify-center rounded-md text-[11px] transition",
                status === "attended" && "bg-green-600/80",
                status === "missed" && "bg-red-600/80",
                !status && "bg-gray-800",
                isToday && "ring-2 ring-indigo-500"
              )}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}