import { useState, useMemo } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

import { usePackages } from "../../packages/domain/PackagesContext"

import {
  createSubscriptionFn,
  updateSubscriptionStartDateFn,
} from "../../../firebase"

import PaymentModal from "../../../components/modals/PaymentModal"

export default function ActivatePackageDrawer({
  client,
  editSubscription = null,
  editStartOnly = false,
  onClose,
}) {
  const { packages } = usePackages()

  /* ================= MODE ================= */

  const mode = editStartOnly
    ? "edit"
    : editSubscription
    ? "replace"
    : "sell"

  /* ================= STATE ================= */

  const todayISO = new Date().toISOString().split("T")[0]

  const [selected, setSelected] = useState(null)
  const [startDate, setStartDate] = useState(
    editSubscription?.startDate?.split("T")[0] || todayISO
  )

  const [showPayment, setShowPayment] = useState(false)
  const [processing, setProcessing] = useState(false)

  const checkId = useMemo(() => `SUB-${Date.now()}`, [])

  const gymId = "sportzal_demo" // keyin authdan olamiz

  /* ===================================================== */
  /* ====================== EDIT MODE ==================== */
  /* ===================================================== */

  if (mode === "edit") {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="flex-1 bg-black/40 backdrop-blur-sm"
          onClick={() => !processing && onClose()}
        />

        <div className="w-[440px] bg-[#0F172A] border-l border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10 flex justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Edit Start Date
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {client?.firstName} {client?.lastName}
              </p>
            </div>
            <button disabled={processing} onClick={onClose}>
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-sm text-gray-400">
              Current Start:
            </div>
            <div className="text-white text-sm">
              {new Date(editSubscription.startDate).toLocaleDateString()}
            </div>

            <div>
              <label className="text-xs text-gray-400">
                New Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="mt-2 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <button
              disabled={processing}
              onClick={async () => {
                if (processing) return
                setProcessing(true)

                try {
                  await updateSubscriptionStartDateFn({
                    gymId,
                    subscriptionId: editSubscription.id,
                    newStartDate: startDate,
                  })

                  onClose()
                } catch (err) {
                  alert(err.message || "Update failed")
                } finally {
                  setProcessing(false)
                }
              }}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ===================================================== */
  /* ================== SELL / REPLACE =================== */
  /* ===================================================== */

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div
          className="flex-1 bg-black/40 backdrop-blur-sm"
          onClick={() => !processing && onClose()}
        />

        <div className="w-[440px] bg-[#0F172A] border-l border-white/10 flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {mode === "replace"
                  ? "Replace Package"
                  : "Activate Package"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {client?.firstName} {client?.lastName}
              </p>
            </div>
            <button disabled={processing} onClick={onClose}>
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {mode === "sell" && (
            <div className="p-6 border-b border-white/10">
              <label className="text-xs text-gray-400">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="mt-2 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {packages.map((pkg) => {
              const isSame =
                mode === "replace" &&
                pkg.id === editSubscription?.packageId

              return (
                <div
                  key={pkg.id}
                  onClick={() =>
                    !processing &&
                    !isSame &&
                    setSelected(pkg)
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition
                  ${
                    selected?.id === pkg.id
                      ? "border-indigo-500 bg-indigo-600/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }
                  ${isSame ? "opacity-40 pointer-events-none" : ""}
                `}
                >
                  <div className="flex justify-between">
                    <span className="text-sm text-white">
                      {pkg.name}
                    </span>
                    <span className="text-sm text-indigo-400">
                      {pkg.price.toLocaleString()} сум
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {selected && (
            <div className="border-t border-white/10 p-6">
              <button
                disabled={processing}
                onClick={() => setShowPayment(true)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition"
              >
                Continue to Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {showPayment && selected && (
        <PaymentModal
          total={selected.price}
          client={{
            name: `${client?.firstName} ${client?.lastName}`,
          }}
          checkNumber={checkId}
          requireComment={mode === "replace"}
          onClose={() =>
            !processing && setShowPayment(false)
          }
          onConfirm={async ({ amounts, comment }) => {
            if (processing) return
            setProcessing(true)

            try {
              await createSubscriptionFn({
                gymId,
                clientId: client.id,
                packageId: selected.id,
                startDate,
                amounts,
                comment: comment || null,
                replaceId:
                  mode === "replace"
                    ? editSubscription.id
                    : null,
              })

              onClose()
            } catch (err) {
              alert(err.message || "Operation failed")
            } finally {
              setProcessing(false)
            }
          }}
        />
      )}
    </>
  )
}