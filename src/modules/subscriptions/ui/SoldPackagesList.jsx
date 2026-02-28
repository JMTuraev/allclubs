import { useMemo, useState } from "react"
import { useSubscriptionsContext } from "../domain/SubscriptionsContext"
import ActivatePackageDrawer from "./ActivatePackageDrawer"
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline"

export default function SoldPackagesList() {
  const { subscriptions = [] } = useSubscriptionsContext()
  const [editSub, setEditSub] = useState(null)

  const rows = useMemo(() => {
    return subscriptions
  }, [subscriptions])

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
        {/* 🔥 overflow-visible bo‘lishi shart */}
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
                <th className="px-6 py-4 text-left">Edit</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {rows.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-gray-800/40 transition"
                >
                  {/* CLIENT */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {sub.clientName}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {sub.clientPhone}
                      </span>
                    </div>
                  </td>

                  {/* PACKAGE */}
                  <td className="px-6 py-4 text-gray-300">
                    {sub.packageSnapshot?.name}
                  </td>

                  {/* VISITS */}
                  <td className="px-6 py-4 text-gray-400">
                    {sub.packageSnapshot?.isUnlimited
                      ? "Unlimited"
                      : `${sub.visitsUsed ?? 0} / ${sub.visitsTotal ?? 0}`}
                  </td>

                  {/* START */}
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(sub.startedAt).toLocaleDateString()}
                  </td>

                  {/* EXPIRE */}
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(sub.expiresAt).toLocaleDateString()}
                  </td>

               {/* STATUS */}
<td className="px-6 py-4">
  <div className="flex items-center gap-3">

    {sub.status === "active" && (
      <span className="px-2 py-1 text-xs rounded bg-green-600 text-white">
        Active
      </span>
    )}

    {sub.status === "expired" && (
      <span className="px-2 py-1 text-xs rounded bg-red-600 text-white">
        Expired
      </span>
    )}

    {sub.status === "replaced" && (
      <>
        <span className="px-2 py-1 text-xs rounded bg-yellow-500 text-black">
          Replaced
        </span>

        {sub.replaceComment && (
          <div className="relative group">

            {/* ICON */}
            <div className="p-1 rounded-md hover:bg-yellow-500/10 transition cursor-pointer">
              <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-yellow-400" />
            </div>

            {/* TOOLTIP */}
            <div
              className="
                absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                w-56
                bg-[#0f172a]
                border border-white/10
                rounded-xl
                shadow-2xl
                p-3
                text-xs text-gray-200
                opacity-0 group-hover:opacity-100
                transition-all duration-200
                pointer-events-none
                z-[9999]
              "
            >
              {sub.replaceComment}

              {/* Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-[#0f172a] border-r border-b border-white/10 rotate-45"></div>
            </div>

          </div>
        )}
      </>
    )}

  </div>
</td>

                  {/* EDIT / COMMENT ICON */}
                  <td className="px-6 py-4">
                    {sub.status === "active" && (
                      <button
                        onClick={() => setEditSub(sub)}
                        className="text-indigo-400 hover:underline text-sm"
                      >
                        Edit
                      </button>
                    )}

                    {sub.status === "replaced" && sub.replaceComment && (
                      <div className="relative group flex items-center justify-center w-fit">
                        
              

                        {/* TOOLTIP */}
                        <div
                          className="
                            absolute bottom-full left-1/2 -translate-x-1/2 mb-3
                            w-64 p-3
                            bg-gray-900 border border-white/10
                            rounded-lg shadow-2xl
                            text-xs text-gray-200
                            opacity-0 group-hover:opacity-100
                            transition-all duration-200
                            pointer-events-none
                            z-50
                          "
                        >
                          {sub.replaceComment}

                          {/* Arrow */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-900 border-r border-b border-white/10 rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editSub && (
        <ActivatePackageDrawer
          client={{
            id: editSub.clientId,
            firstName: editSub.clientName?.split(" ")[0],
            lastName: editSub.clientName?.split(" ")[1],
            phone: editSub.clientPhone,
          }}
          editSubscription={editSub}
          onClose={() => setEditSub(null)}
        />
      )}
    </>
  )
}