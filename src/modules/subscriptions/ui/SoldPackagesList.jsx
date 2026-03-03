import { useMemo, useState } from "react"
import { useSubscriptionsContext } from "../domain/SubscriptionsContext"
import { useClientsContext } from "../../clients/domain/ClientsContext"
import ActivatePackageDrawer from "./ActivatePackageDrawer"
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline"

export default function SoldPackagesList() {
  const { subscriptions = [] } = useSubscriptionsContext()
  const { clients = [] } = useClientsContext()

  const [editSub, setEditSub] = useState(null)
  const [replaceSub, setReplaceSub] = useState(null)

  const rows = useMemo(() => subscriptions, [subscriptions])

  if (rows.length === 0) {
    return (
      <div className="p-6 text-gray-400">
        No sold packages yet
      </div>
    )
  }

  return (
    <>
      <div className="px-6">
        <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-visible">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-left">Package</th>
                <th className="px-6 py-4 text-left">Visits</th>
                <th className="px-6 py-4 text-left">Start</th>
                <th className="px-6 py-4 text-left">Expire</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {rows.map((sub) => {
                /* ================= CLIENT FALLBACK ================= */

                const client = clients.find(
                  (c) => String(c.id) === String(sub.clientId)
                )

                const clientName =
                  sub.clientName ||
                  (client
                    ? `${client.firstName} ${client.lastName}`
                    : "Unknown")

                const clientPhone =
                  sub.clientPhone ||
                  (client ? client.phone : "")

                /* ================= VISITS ================= */

                const usedVisits =
                  sub.visitLimit != null
                    ? sub.visitLimit - (sub.remainingVisits ?? 0)
                    : null

                /* ================= STATUS ================= */

                const isReplaced = sub.status === "replaced"

                const canEdit =
                  !isReplaced &&
                  sub.sessionsCount === 0 &&
                  (sub.status === "scheduled" ||
                    sub.status === "active")

                const canReplace =
                  !isReplaced &&
                  sub.sessionsCount === 0 &&
                  (sub.status === "scheduled" ||
                    sub.status === "active")

                return (
                  <tr
                    key={sub.id}
                    className={`transition ${
                      isReplaced
                        ? "bg-red-900/20"
                        : "hover:bg-gray-800/40"
                    }`}
                  >
                    {/* CLIENT */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span
                          className={`font-medium ${
                            isReplaced
                              ? "text-red-300"
                              : "text-white"
                          }`}
                        >
                          {clientName}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {clientPhone}
                        </span>
                      </div>
                    </td>

                    {/* PACKAGE */}
                    <td className="px-6 py-4 text-gray-300">
                      {sub.packageSnapshot?.name || "-"}
                    </td>

                    {/* VISITS */}
                    <td className="px-6 py-4 text-gray-400">
                      {usedVisits === null
                        ? "Unlimited"
                        : `${usedVisits} / ${sub.visitLimit}`}
                    </td>

                    {/* START */}
                    <td className="px-6 py-4 text-gray-400">
                      {sub.startDate
                        ? new Date(sub.startDate).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* EXPIRE */}
                    <td className="px-6 py-4 text-gray-400">
                      {sub.endDate
                        ? new Date(sub.endDate).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        {sub.status === "active" && (
                          <span className="px-2 py-1 text-xs rounded bg-green-600 text-white">
                            Active
                          </span>
                        )}

                        {sub.status === "scheduled" && (
                          <span className="px-2 py-1 text-xs rounded bg-blue-600 text-white">
                            Scheduled
                          </span>
                        )}

                        {sub.status === "expired" && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-600 text-white">
                            Expired
                          </span>
                        )}

                        {sub.status === "cancelled" && (
                          <span className="px-2 py-1 text-xs rounded bg-gray-700 text-white">
                            Cancelled
                          </span>
                        )}

                        {isReplaced && (
                          <>
                            <span className="px-2 py-1 text-xs rounded bg-red-600 text-white">
                              Replaced
                            </span>

                            {sub.replaceComment && (
                              <div className="relative group cursor-pointer">
                                <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-red-400" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#0f172a] border border-red-500/30 rounded-xl shadow-2xl p-3 text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                                  <div className="text-red-400 mb-1 font-semibold">
                                    Replace Reason:
                                  </div>
                                  {sub.replaceComment}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        {canEdit && (
                          <button
                            onClick={() => setEditSub(sub)}
                            className="text-indigo-400 hover:underline text-sm"
                          >
                            Edit
                          </button>
                        )}

                        {canReplace && (
                          <button
                            onClick={() => setReplaceSub(sub)}
                            className="text-indigo-400 hover:underline text-sm"
                          >
                            Replace
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT */}
      {editSub && (
        <ActivatePackageDrawer
          client={{
            id: editSub.clientId,
            firstName:
              editSub.clientName?.split(" ")[0] || "",
            lastName:
              editSub.clientName?.split(" ")[1] || "",
            phone: editSub.clientPhone || "",
          }}
          editStartOnly
          editSubscription={editSub}
          onClose={() => setEditSub(null)}
        />
      )}

      {/* REPLACE */}
      {replaceSub && (
        <ActivatePackageDrawer
          client={{
            id: replaceSub.clientId,
            firstName:
              replaceSub.clientName?.split(" ")[0] || "",
            lastName:
              replaceSub.clientName?.split(" ")[1] || "",
            phone: replaceSub.clientPhone || "",
          }}
          editSubscription={replaceSub}
          onClose={() => setReplaceSub(null)}
        />
      )}
    </>
  )
}