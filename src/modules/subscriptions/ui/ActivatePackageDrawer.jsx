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

  const {
    transactions,
    addTransaction,
  } = useTransactions()

  const {
    sellSubscription,
    replaceSubscription,
    getActiveSubscriptionByClient,
  } = useSubscriptionsContext()

  const [selected, setSelected] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [processing, setProcessing] = useState(false)

  const todayISO = new Date().toISOString().split("T")[0]
  const [startDate, setStartDate] = useState(todayISO)

  const checkId = useMemo(() => `SUB-${Date.now()}`, [])

  const isEditMode = !!editSubscription
  const activeSub = getActiveSubscriptionByClient(client?.id)

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
                {isEditMode ? "Replace Package" : "Activate Package"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {client?.firstName} {client?.lastName}
              </p>
            </div>

            <button disabled={processing} onClick={onClose}>
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {!isEditMode && (
            <div className="p-6 border-b border-white/10">
              <label className="text-xs text-gray-400">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                min={todayISO}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
              {activeSub && (
                <div className="mt-3 text-xs text-amber-400">
                  Client already has active subscription.
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {packages.map((pkg) => {
              const isSame =
                isEditMode &&
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

      {showPayment && selected && (
        <PaymentModal
          total={selected.price}
          client={{
            name: `${client?.firstName} ${client?.lastName}`,
          }}
          checkNumber={checkId}
          requireComment={isEditMode}
          onClose={() =>
            !processing && setShowPayment(false)
          }
          onConfirm={async ({ amounts, comment }) => {
            if (processing) return
            setProcessing(true)

            try {
              let newSubscriptionId = null

              if (isEditMode) {

                if (!comment?.trim()) {
                  alert("Comment is required for replace")
                  return
                }

                if (editSubscription.sessionsCount > 0) {
                  alert("Cannot replace after session started")
                  return
                }

                // 1️⃣ Eski paymentlarni topamiz
                const oldPayments = transactions.filter(
                  (t) =>
                    t.source === "subscription" &&
                    t.sourceId === editSubscription.id &&
                    t.type === "payment"
                )

                // 2️⃣ Eski sotib olingan summani minus bilan yozamiz
                oldPayments.forEach((p) => {
                  addTransaction({
                    type: "payment",
                    category: "package",
                    clientId: client.id,
                    amount: -Math.abs(Number(p.amount)),
                    paymentMethod: p.paymentMethod,
                    meta: {
                      replaceRefund: true
                    }
                  })
                })

                // 3️⃣ Yangi subscription yaratamiz
                newSubscriptionId = replaceSubscription(
                  editSubscription.id,
                  client,
                  selected,
                  comment
                )

              } else {

                newSubscriptionId = sellSubscription(
                  client,
                  selected,
                  startDate
                )
              }

              // 4️⃣ Yangi service yoziladi
              addTransaction({
                type: "service",
                category: "package",
                clientId: client.id,
                amount: Number(selected.price),
                source: "subscription",
                sourceId: newSubscriptionId,
              })

              // 5️⃣ Yangi payment yoziladi
              Object.entries(amounts).forEach(
                ([method, amount]) => {
                  if (Number(amount) > 0) {
                    addTransaction({
                      type: "payment",
                      category: "package",
                      clientId: client.id,
                      amount: Number(amount),
                      paymentMethod: method,
                      source: "subscription",
                      sourceId: newSubscriptionId,
                    })
                  }
                }
              )

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