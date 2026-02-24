import { useState, Fragment } from "react"

export default function Table({ sessions = [] }) {
  const [expanded, setExpanded] = useState(null)
  const [confirmEnd, setConfirmEnd] = useState(null)

  /* ===== LEDGER TOTAL ===== */

  const calculateTotal = (s) =>
    s.transactions?.reduce(
      (t, i) => t + (i.amount || 0),
      0
    ) || 0

  /* ===== CLIENT STATS ===== */

  const uniqueClients = [
    ...new Set(
      sessions.map((s) =>
        s.type === "guest" ? "Guest" : s.client
      )
    ),
  ]

  const totalClients = uniqueClients.length

  const activeClients = [
    ...new Set(
      sessions
        .filter((s) => s.status === "active")
        .map((s) =>
          s.type === "guest" ? "Guest" : s.client
        )
    ),
  ].length

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-full divide-y divide-white/10">

          {/* ================= HEADER ================= */}
          <thead className="bg-gray-900/40">
            <tr className="h-16">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                <div className="flex items-center gap-3">
                  <span>Client</span>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">
                      {totalClients} total
                    </span>

                    <span className="text-green-400">
                      {activeClients} active
                    </span>
                  </div>
                </div>
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                Staff
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                Total
              </th>

              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                Status
              </th>

              <th className="px-6 py-4" />
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody className="divide-y divide-white/10">

            {sessions.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              sessions.map((session) => {
                const total = calculateTotal(session)
                const isOpen = expanded === session.id

                return (
                  <Fragment key={session.id}>
                    <tr className="hover:bg-white/5 transition">
                      
                      {/* CLIENT */}
                      <td className="px-6 py-5 flex items-center gap-3">
                        <img
                          src={
                            session.type === "guest"
                              ? "https://ui-avatars.com/api/?name=Guest"
                              : session.image
                          }
                          className="w-10 h-10 rounded-full object-cover"
                          alt=""
                        />

                        <div>
                          <div className="font-medium">
                            {session.type === "guest" ? (
                              <span className="text-amber-400">
                                Guest
                              </span>
                            ) : (
                              <span className="text-white">
                                {session.client}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-gray-400">
                            {session.id}
                          </div>
                        </div>
                      </td>

                      {/* STAFF */}
                      <td className="px-6 py-5 text-gray-400">
                        {session.staff}
                      </td>

                      {/* TOTAL */}
                      <td className="px-6 py-5 font-semibold text-emerald-400">
                        {total.toLocaleString()} so'm
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        {session.status === "active" ? (
                          <span className="text-green-400">
                            Active
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            Ended
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5 text-right space-x-4">
                        <button
                          onClick={() =>
                            setExpanded(
                              isOpen ? null : session.id
                            )
                          }
                          className="text-indigo-400 hover:text-indigo-300 transition"
                        >
                          Details
                        </button>

                        {session.status === "active" && (
                          <button
                            onClick={() =>
                              setConfirmEnd(session.id)
                            }
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            End
                          </button>
                        )}
                      </td>
                    </tr>

                    {isOpen && (
                      <tr>
                        <td
                          colSpan="5"
                          className="bg-gray-900/50 p-6"
                        >
                          <DetailTabs session={session} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })
            )}

          </tbody>
        </table>
      </div>

      {confirmEnd && (
        <EndSessionModal
          onClose={() => setConfirmEnd(null)}
        />
      )}
    </>
  )
}

/* ================= DETAIL TABS ================= */

function DetailTabs({ session }) {
  const [tab, setTab] = useState("bar")

  const tabs =
    session.type === "guest"
      ? ["bar"]
      : ["bar", "package", "trainer"]

  const filtered =
    session.transactions?.filter(
      (tx) => tx.type === tab
    ) || []

  return (
    <div>
      <div className="flex gap-6 border-b border-white/10 pb-3 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`capitalize text-sm ${
              tab === t
                ? "text-indigo-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-sm text-gray-500">
          No transactions
        </div>
      )}

      {filtered.map((i) => (
        <div
          key={i.id}
          className="flex justify-between py-2 border-b border-white/10 text-sm text-gray-300"
        >
          <span>{i.title}</span>
          <span>{i.amount.toLocaleString()} so'm</span>
        </div>
      ))}
    </div>
  )
}

/* ================= EMPTY ================= */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">

      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        No sessions yet
      </h3>

      <p className="text-gray-400 text-sm max-w-sm">
        No operations have been performed.
        Start a session to see activity here.
      </p>

    </div>
  )
}

/* ================= MODAL ================= */

function EndSessionModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-96">
        <h2 className="text-white font-semibold mb-4">
          End this session?
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Session will be finalized and cannot be edited.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 px-4 py-2 rounded-md text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}