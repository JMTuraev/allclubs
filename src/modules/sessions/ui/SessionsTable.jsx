import { useEffect, useState } from "react"

export default function SessionsTable({ sessions = [] }) {

  const [, forceUpdate] = useState(0)

  /* realtime timer */

  useEffect(() => {

    const interval = setInterval(() => {
      forceUpdate(v => v + 1)
    }, 1000)

    return () => clearInterval(interval)

  }, [])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

      <table className="w-full text-sm">

        <thead className="text-gray-400">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Package</th>
            <th className="p-3 text-left">Check-In</th>
            <th className="p-3 text-left">Check-Out</th>
            <th className="p-3 text-left">Duration</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Staff</th>
          </tr>
        </thead>

        <tbody>

          {sessions.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-6 text-gray-500">
                No sessions found
              </td>
            </tr>
          )}

          {sessions.map((s, index) => {

            /* universal field mapping */

            const checkIn = parseDate(
              s.checkIn ||
              s.checkInAt ||
              s.startAt ||
              s.startedAt
            )

            const checkOut = parseDate(
              s.checkOut ||
              s.checkOutAt ||
              s.endAt ||
              s.endedAt
            )

            const duration = getDuration(checkIn, checkOut)

            const online = !checkOut

            const packageName =
              s.packageName ||
              s.package?.name ||
              "-"

            const staffName =
              s.staffName ||
              s.staff?.name ||
              s.staffFullName ||
              "-"

            return (
              <tr
                key={s.id || index}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >

                {/* Row number */}
                <td className="p-3">{index + 1}</td>

                {/* Package */}
                <td className="p-3">
                  {packageName}
                </td>

                {/* Check-in */}
                <td className="p-3">
                  {formatTime(checkIn)}
                </td>

                {/* Check-out */}
                <td className="p-3">
                  {formatTime(checkOut)}
                </td>

                {/* Duration */}
                <td className="p-3 font-semibold text-indigo-300">
                  {duration}
                </td>

                {/* Status */}
                <td className="p-3">
                  {online ? (
                    <span className="text-green-400 font-medium">
                      Online
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Offline
                    </span>
                  )}
                </td>

                {/* Staff */}
                <td className="p-3">
                  {staffName}
                </td>

              </tr>
            )

          })}

        </tbody>

      </table>

    </div>
  )
}

/* ============================= */
/* Firestore Timestamp → Date    */
/* ============================= */

function parseDate(value) {

  if (!value) return null

  if (typeof value?.toDate === "function") {
    return value.toDate()
  }

  return new Date(value)
}

/* ============================= */
/* Duration calculation          */
/* ============================= */

function getDuration(start, end) {

  if (!start) return "-"

  const now = end || new Date()

  const diff = now - start

  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)

  return `${hours}h ${minutes}m`
}

/* ============================= */
/* Time formatter                */
/* ============================= */

function formatTime(date) {

  if (!date) return "-"

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
}