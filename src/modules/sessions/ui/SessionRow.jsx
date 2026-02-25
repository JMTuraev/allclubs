import SessionDetails from "./SessionDetails"
import { useSessionsContext } from "../domain/SessionsContext"

export default function SessionRow({
  session,
  expanded,
  onToggle
}) {
  const { endSession } = useSessionsContext()

  return (
    <>
      <tr className="hover:bg-white/5 transition">
        <td className="px-6 py-5">
          <div className="font-medium text-white">
            {session.clientName}
          </div>
          <div className="text-xs text-gray-400">
            {session.id}
          </div>
        </td>

        <td className="px-6 py-5 text-gray-400">
          {session.staffName}
        </td>

        <td className="px-6 py-5 font-semibold text-emerald-400">
          {(session.totalAmount || 0).toLocaleString()} so'm
        </td>

        <td className="px-6 py-5">
          {session.status === "active" ? (
            <span className="text-green-400">
              Active
            </span>
          ) : (
            <span className="text-gray-400">
              Closed
            </span>
          )}
        </td>

        <td className="px-6 py-5 text-right space-x-4">
          <button
            onClick={onToggle}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Details
          </button>

          {session.status === "active" && (
            <button
              onClick={() => endSession(session.id)}
              className="text-red-400 hover:text-red-300"
            >
              End
            </button>
          )}
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan="5" className="bg-white/5 p-6">
            <SessionDetails session={session} />
          </td>
        </tr>
      )}
    </>
  )
}