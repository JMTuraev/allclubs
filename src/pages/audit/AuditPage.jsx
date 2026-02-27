import { useAudit } from "../../modules/audit/AuditContext"

export default function AuditPage() {
  const { events } = useAudit()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Audit Log</h1>

      {events.length === 0 ? (
        <p>No audit records yet</p>
      ) : (
        <ul className="space-y-2">
          {events.map(e => (
            <li key={e.id} className="border p-3 rounded">
              <div>{e.type}</div>
              <div className="text-sm text-gray-500">
                {new Date(e.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}