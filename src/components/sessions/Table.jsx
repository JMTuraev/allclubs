import { useState } from "react"

export default function Table({ sessions }) {
  const [expanded, setExpanded] = useState(null)
  const [confirmEnd, setConfirmEnd] = useState(null)

  const calculateTotal = (s) =>
    [...s.bar, ...s.package, ...s.trainer].reduce(
      (t, i) => t + i.price,
      0
    )

  /* ===== CLIENT STATS ===== */

  // Unique clientlar soni
  const uniqueClients = [
    ...new Set(sessions.map((s) => s.client)),
  ]

  const totalClients = uniqueClients.length

  // Active sessionga ega clientlar
  const activeClients = [
    ...new Set(
      sessions
        .filter((s) => s.status === "active")
        .map((s) => s.client)
    ),
  ].length

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-gray-900/40">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <span>Client</span>

                  {/* CLIENT STATS */}
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

              <th className="px-4 py-3 text-left text-sm text-gray-300">
                Staff
              </th>

              <th className="px-4 py-3 text-left text-sm text-gray-300">
                Total
              </th>

              <th className="px-4 py-3 text-left text-sm text-gray-300">
                Status
              </th>

              <th></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {sessions.map((session) => {
              const total = calculateTotal(session)
              const isOpen = expanded === session.id

              return (
                <>
                  <tr
                    key={session.id}
                    className="hover:bg-white/5 transition"
                  >
                    {/* CLIENT */}
                    <td className="px-4 py-4 flex items-center gap-3">
                      <img
                        src={session.image}
                        className="w-10 h-10 rounded-full object-cover"
                        alt=""
                      />

                      <div>
                        <div className="text-white font-medium">
                          {session.client}
                        </div>

                        <div className="text-xs text-gray-400">
                          {session.id}
                        </div>
                      </div>
                    </td>

                    {/* STAFF */}
                    <td className="px-4 py-4 text-gray-400">
                      {session.staff}
                    </td>

                    {/* TOTAL */}
                    <td className="px-4 py-4 font-semibold text-emerald-400">
                      {total.toLocaleString()} so'm
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
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
                    <td className="px-4 py-4 text-right space-x-4">
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
                </>
              )
            })}
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

  const render = (items) =>
    items.map((i, idx) => (
      <div
        key={idx}
        className="flex justify-between py-2 border-b border-white/10 text-sm text-gray-300"
      >
        <span>{i.name}</span>
        <span>{i.price.toLocaleString()} so'm</span>
      </div>
    ))

  return (
    <div>
      <div className="flex gap-6 border-b border-white/10 pb-3 mb-4">
        {["bar", "package", "trainer"].map((t) => (
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

      {tab === "bar" && render(session.bar)}
      {tab === "package" && render(session.package)}
      {tab === "trainer" && render(session.trainer)}
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