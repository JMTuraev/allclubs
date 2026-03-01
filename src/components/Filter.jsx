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

  /* ========================= */
  /* CLOSE ON OUTSIDE CLICK   */
  /* ========================= */

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* ========================= */
  /* SAFE EMIT FUNCTION       */
  /* ========================= */

  const emitChange = (type, from = null, to = null) => {
    onChange?.({
      type,
      from,
      to,
    })
  }

  /* ========================= */
  /* QUICK FILTER HANDLER     */
  /* ========================= */

  const applyQuickFilter = (value) => {
    const now = new Date()

    setActiveFilter(value)
    setOpen(false)

    if (value === "today") {
      emitChange("today", now, now)
      return
    }

    if (value === "yesterday") {
      const y = new Date()
      y.setDate(y.getDate() - 1)
      emitChange("yesterday", y, y)
      return
    }

    if (value === "7") {
      const from = new Date()
      from.setDate(from.getDate() - 6)
      emitChange("7", from, now)
      return
    }

    if (value === "30") {
      const from = new Date()
      from.setDate(from.getDate() - 29)
      emitChange("30", from, now)
      return
    }

    if (value === "month") {
      const first = new Date(now.getFullYear(), now.getMonth(), 1)
      emitChange("month", first, now)
      return
    }

    if (value === "all") {
      emitChange("all", null, null)
      return
    }
  }

  /* ========================= */
  /* CUSTOM RANGE HANDLER     */
  /* ========================= */

  const handleSelect = (date) => {
    setActiveFilter("custom")

    if (!range.from || (range.from && range.to)) {
      setRange({ from: date, to: null })
    } else {
      let newFrom = range.from
      let newTo = date

      if (date < range.from) {
        newFrom = date
        newTo = range.from
      }

      setRange({ from: newFrom, to: newTo })

      setOpen(false)
      emitChange("custom", newFrom, newTo)
    }
  }

  /* ========================= */
  /* LABEL                    */
  /* ========================= */

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

  /* ========================= */
  /* CALENDAR HELPERS         */
  /* ========================= */

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

  const isSame = (a, b) =>
    a && b && a.toDateString() === b.toDateString()

  const inRange = (d) => {
    if (!range.from || !range.to) return false
    return d >= range.from && d <= range.to
  }

  /* ========================= */
  /* UI                       */
  /* ========================= */

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
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
                onClick={() => applyQuickFilter(value)}
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