import { useState, useMemo, useRef, useEffect } from "react"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"

export default function Filter({ onChange }) {
  const today = new Date()

  const [open, setOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState("today")
  const [range, setRange] = useState({
    from: today,
    to: today,
  })

  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    onChange({ activeFilter, range })
  }, [activeFilter, range])

  const label = useMemo(() => {
    if (activeFilter === "today") return "Today"
    if (activeFilter === "yesterday") return "Yesterday"
    if (activeFilter === "7") return "Last 7 days"
    if (activeFilter === "30") return "Last 30 days"
    if (activeFilter === "month") return "This month"
    if (activeFilter === "all") return "All time"

    if (range.from && range.to) {
      return `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
    }

    return "Filter"
  }, [activeFilter, range])

  const currentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )

  const months = [
    currentMonth,
    new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    ),
  ]

  const getDays = (year, month) => {
    const last = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: last }, (_, i) =>
      new Date(year, month, i + 1)
    )
  }

  const handleSelect = (date) => {
    setActiveFilter("custom")

    if (!range.from || (range.from && range.to)) {
      setRange({ from: date, to: null })
    } else {
      if (date < range.from) {
        setRange({ from: date, to: range.from })
      } else {
        setRange({ from: range.from, to: date })
      }
    }
  }

  const isSame = (a, b) =>
    a && b && a.toDateString() === b.toDateString()

  const inRange = (d) => {
    if (!range.from || !range.to) return false
    return d >= range.from && d <= range.to
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white hover:bg-gray-700"
      >
        <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
        {label}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-[850px] shadow-2xl flex gap-8">
          {/* CALENDAR */}
          <div className="flex gap-12">
            {months.map((m, idx) => (
              <div key={idx} className="w-72">
                <div className="text-white font-semibold mb-6 text-lg">
                  {m.toLocaleString("ru-RU", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <div className="grid grid-cols-7 gap-y-3 text-gray-300 text-sm">
                  {getDays(
                    m.getFullYear(),
                    m.getMonth()
                  ).map((d) => {
                    const selectedStart = isSame(d, range.from)
                    const selectedEnd = isSame(d, range.to)
                    const between = inRange(d)

                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => handleSelect(d)}
                        className={`h-9 flex items-center justify-center
                          ${
                            between
                              ? "bg-indigo-500/20"
                              : "hover:bg-gray-800"
                          }
                        `}
                      >
                        <span
                          className={`px-2 py-1
                            ${
                              selectedStart || selectedEnd
                                ? "bg-indigo-600 text-white rounded-full"
                                : ""
                            }
                          `}
                        >
                          {d.getDate()}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* QUICK FILTERS */}
          <div className="w-56 border-l border-white/10 pl-6 text-gray-400 text-sm space-y-4">
            {[
              ["Сегодня", "today"],
              ["Вчера", "yesterday"],
              ["Последние 7 дней", "7"],
              ["Последние 30 дней", "30"],
              ["Этот месяц", "month"],
              ["За все время", "all"],
            ].map(([label, value]) => (
              <button
                key={value}
                onClick={() => {
                  setActiveFilter(value)
                  setOpen(false)
                }}
                className={`block text-left ${
                  activeFilter === value
                    ? "text-white font-medium"
                    : "hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}