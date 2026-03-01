import { useState, useMemo } from "react"
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function ClientCalendar({ sessions = [] }) {
  const today = new Date()

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  /* ================= OFFSET (MONDAY START) ================= */

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  /* ================= SESSION MAP ================= */

  const sessionMap = useMemo(() => {
    const map = {}

    sessions.forEach((session) => {
      const date = new Date(session.date || session.createdAt)

      if (
        date.getFullYear() === year &&
        date.getMonth() === month
      ) {
        const day = date.getDate()

        if (!map[day]) map[day] = []
        map[day].push(session.status || "attended")
      }
    })

    return map
  }, [sessions, year, month])

  /* ================= NAVIGATION ================= */

  const goPrevMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    )
  }

  const goNextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    )
  }

  /* ================= RENDER ================= */

  return (
    <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <CalendarIcon className="w-4 h-4" />
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={goPrevMonth}
            className="p-1 hover:bg-white/10 rounded"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          <button
            onClick={goNextMonth}
            className="p-1 hover:bg-white/10 rounded"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WEEKDAYS */}
      <div className="grid grid-cols-7 text-[10px] text-gray-400 mb-2">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={`${d}-${i}`}>{d}</div>
        ))}
      </div>

      {/* DAYS GRID */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty offset cells */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Actual days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const daySessions = sessionMap[day] || []
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()

          const hasMissed = daySessions.includes("missed")
          const hasAttended = daySessions.includes("attended")

          return (
            <div
              key={`${year}-${month}-${day}`}
              className={classNames(
                "h-8 flex items-center justify-center rounded-md text-xs transition relative",
                hasAttended && "bg-green-600/70",
                hasMissed && "bg-red-600/70",
                !hasAttended &&
                  !hasMissed &&
                  "bg-gray-800",
                isToday && "ring-2 ring-indigo-500"
              )}
            >
              {day}

              {/* Multiple session indicator */}
              {daySessions.length > 1 && (
                <span className="absolute bottom-1 right-1 text-[8px] text-white/70">
                  {daySessions.length}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}