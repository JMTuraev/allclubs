import SessionRow from "./SessionRow"

export default function SessionsTable({
  sessions,
  expandedId,
  setExpandedId,
}) {

  if (!sessions.length) {
    return <EmptyState />
  }

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr>
            <th className="px-6 py-4 text-left text-sm text-gray-300">
              Client
            </th>
            <th className="px-6 py-4 text-left text-sm text-gray-300">
              Staff
            </th>
            <th className="px-6 py-4 text-left text-sm text-gray-300">
              Total
            </th>
            <th className="px-6 py-4 text-left text-sm text-gray-300">
              Status
            </th>
            <th className="px-6 py-4" />
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              session={session}
              expanded={expandedId === session.id}
              onToggle={() =>
                setExpandedId(
                  expandedId === session.id
                    ? null
                    : session.id
                )
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center border border-white/10 rounded-xl bg-white/5">
      <div className="text-gray-400">
        No sessions found
      </div>
    </div>
  )
}