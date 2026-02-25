import { useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useClientsContext } from "../../modules/clients/domain/ClientsContext"
import PaymentModal from "./PaymentModal"

export default function ActivatePackageModal({
  pkg,
  clients,
  preselectedClient,
  onClose,
}) {
  const { assignPackage } = useClientsContext()

  const [selectedClientId, setSelectedClientId] = useState(
    preselectedClient?.id || ""
  )

  const [showPayment, setShowPayment] = useState(false)

  const selectedClient = clients.find(
    (c) => String(c.id) === String(selectedClientId)
  )

  /* ================= PAYMENT CONFIRM ================= */

  const handlePaymentConfirm = (paymentData) => {
    if (!selectedClient) return

    const { amounts, comment, method, total } = paymentData

    // 🔥 bu yerda agar xohlasang finance transaction yozish mumkin
    console.log("Payment:", amounts)
    console.log("Method:", method)
    console.log("Comment:", comment)
    console.log("Total:", total)

    assignPackage(selectedClient.id, pkg)

    setShowPayment(false)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-md bg-[#111827] rounded-2xl border border-white/10">

          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">
              Activate {pkg.name}
            </h2>
            <button onClick={onClose}>
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">

            {!preselectedClient && (
              <select
                value={selectedClientId}
                onChange={(e) =>
                  setSelectedClientId(e.target.value)
                }
                className="w-full bg-gray-800 rounded-lg px-3 py-2"
              >
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </select>
            )}

            <div className="text-sm text-gray-400">
              Price:{" "}
              <span className="text-white font-semibold">
                {pkg.price.toLocaleString("ru-RU")} сум
              </span>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            >
              Cancel
            </button>

            <button
              disabled={!selectedClient}
              onClick={() => setShowPayment(true)}
              className="px-5 py-2 bg-indigo-600 rounded-lg disabled:opacity-40"
            >
              Continue
            </button>
          </div>

        </div>
      </div>

      {showPayment && (
        <PaymentModal
          total={pkg.price}
          client={selectedClient}
          onClose={() => setShowPayment(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}
    </>
  )
}