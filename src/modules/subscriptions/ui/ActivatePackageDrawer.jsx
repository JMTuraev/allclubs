import { useState, useMemo } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

import { usePackages } from "../../packages/domain/PackagesContext"
import { useTransactions } from "../../../context/transaction/TransactionContext"
import { useSubscriptionsContext } from "../domain/SubscriptionsContext"

import PaymentModal from "../../../components/modals/PaymentModal"

export default function ActivatePackageDrawer({
  client,
  editSubscription = null,
  onClose,
}) {
  const { packages } = usePackages()
  const { addTransaction: addFinanceTx } = useTransactions()
  const {
    activateSubscription,
    replaceSubscription,
  } = useSubscriptionsContext()

  const [selected, setSelected] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [processing, setProcessing] = useState(false)

  const checkId = useMemo(() => `SUB-${Date.now()}`, [])
  const isEditMode = !!editSubscription

  const oldPackageId = editSubscription?.packageSnapshot?.id

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div
          className="flex-1 bg-black/40 backdrop-blur-sm"
          onClick={() => !processing && onClose()}
        />

        <div className="w-[440px] bg-[#0F172A] border-l border-white/10 flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {isEditMode ? "Edit Package" : "Activate Package"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {client?.firstName} {client?.lastName}
              </p>
            </div>

            <button disabled={processing} onClick={onClose}>
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* PACKAGE LIST */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {packages.map((pkg) => {
              const isSamePackage = isEditMode && pkg.id === oldPackageId

              return (
                <div
                  key={pkg.id}
                  onClick={() =>
                    !processing && !isSamePackage && setSelected(pkg)
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition
                    ${
                      selected?.id === pkg.id
                        ? "border-indigo-500 bg-indigo-600/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }
                    ${isSamePackage ? "opacity-40 pointer-events-none" : ""}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white">
                      {pkg.name}
                    </span>

                    <span className="text-sm text-indigo-400">
                      {pkg.price.toLocaleString("ru-RU")} сум
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* FOOTER */}
          {selected && (
            <div className="border-t border-white/10 p-6 mt-auto">
              <div className="flex justify-between text-gray-400 text-sm mb-4">
                <span>Total</span>
                <span>
                  {selected.price.toLocaleString("ru-RU")} сум
                </span>
              </div>

              <button
                disabled={processing}
                onClick={() => setShowPayment(true)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition disabled:opacity-50"
              >
                Continue to Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && selected && (
        <PaymentModal
          total={selected.price}
          client={{
            name: `${client?.firstName} ${client?.lastName}`,
          }}
          checkNumber={checkId}
          onClose={() => !processing && setShowPayment(false)}
          onConfirm={async (paymentData) => {
            if (processing) return
            setProcessing(true)

            try {
              const { amounts, comment } = paymentData

              if (isEditMode && !comment?.trim()) {
                alert("Comment is required for edit")
                return
              }

              /* ================= EDIT LOGIC ================= */

              if (isEditMode) {
                const oldPrice =
                  Number(editSubscription.packageSnapshot?.price) || 0

                // 1️⃣ Replace subscription
                replaceSubscription(editSubscription.id, comment)

                // 2️⃣ Refund old service (minus)
                if (oldPrice > 0) {
                  addFinanceTx({
                    type: "service_refund",
                    category: "package",
                    clientId: client.id,
                    amount: -oldPrice,
                    meta: {
                      replacedSubscriptionId: editSubscription.id,
                      oldPackageName:
                        editSubscription.packageSnapshot?.name,
                    },
                    comment: `Package edited refund`,
                  })
                }
              }

              /* ================= NEW SERVICE ================= */

              addFinanceTx({
                type: "service",
                category: "package",
                clientId: client.id,
                amount: Number(selected.price),
                meta: {
                  packageId: selected.id,
                  packageName: selected.name,
                  editedFrom:
                    editSubscription?.packageSnapshot?.name || null,
                },
              })

              /* ================= PAYMENT ================= */

          Object.entries(amounts).forEach(([method, amount]) => {
  if (Number(amount) > 0) {
    addFinanceTx({
      type: "payment",
      category: "package",
      clientId: client.id,
      amount: Number(amount),
      paymentMethod: method,
      comment,

      // 🔥 ENG MUHIM
      meta: {
        packageId: selected.id,
        packageName: selected.name,
        subscriptionId: editSubscription?.id || null,
        editedFrom:
          editSubscription?.packageSnapshot?.name || null,
      },
    })
  }
})
              /* ================= ACTIVATE NEW ================= */

              activateSubscription(client, selected)

              setShowPayment(false)
              setSelected(null)
              onClose()
            } finally {
              setProcessing(false)
            }
          }}
        />
      )}
    </>
  )
}