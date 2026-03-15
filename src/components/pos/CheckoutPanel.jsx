import { useState } from "react";

export default function CheckoutPanel({
  selectedClient,
  cart,
  total,
  onDecrease,
  onPayment,
  onLater,
  checks = [],
  selectedCheckId = null,
  onSelectCheck
}) {

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isHistoryMode = selectedCheckId !== null

  const selectedCheck = checks.find(c => c.id === selectedCheckId)

  const isPaid = selectedCheck?.status === "paid"

  console.log("checks:", checks)

  return (
    <div className="h-full flex flex-col">

      {/* HEADER */}

      <div className="px-4 py-3 border-b border-white/10 shrink-0 flex justify-between items-center">

        <div className="text-sm font-semibold">
          {isHistoryMode
            ? `History Check`
            : `Check ${selectedClient ? `#${selectedClient.locker}` : "-"}`}
        </div>

        {/* CHECKS BUTTON */}

        <div className="relative">

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20"
          >
            Checks ({checks.length})
          </button>

          {dropdownOpen && (

            <div className="absolute right-0 mt-2 w-44 bg-[#111827] border border-white/10 rounded shadow-lg z-20">

              {checks.length === 0 && (
                <div className="px-3 py-2 text-xs text-gray-400">
                  No checks
                </div>
              )}

              {checks.map(check => (

                <div
                  key={check.id}
                  onClick={() => {
                    setDropdownOpen(false)
                    onSelectCheck && onSelectCheck(check.id)
                  }}
                  className={`px-3 py-2 text-xs cursor-pointer hover:bg-white/10 ${
                    selectedCheckId === check.id
                      ? "bg-white/10"
                      : ""
                  }`}
                >

                  #{check.number || check.id.slice(0,4)}

                  <span className="float-right text-emerald-400">
                    {check.totalAmount?.toLocaleString()}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* BODY */}

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

        {cart.length === 0 && (
          <div className="text-xs text-gray-500">
            No items
          </div>
        )}

        {cart.map(item => (

          <div
            key={item.productId || item.id}
            className="flex justify-between items-center text-sm"
          >

            <div className="min-w-0">

              <div className="font-medium truncate">
                {item.name}
              </div>

              <div className="text-[11px] text-gray-400">
                {item.qty} × {item.price.toLocaleString()}
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="font-medium text-sm">
                {(item.qty * item.price).toLocaleString()}
              </div>

              {!isHistoryMode && onDecrease && (
                <button
                  onClick={() => onDecrease(item.productId)}
                  className="text-xs text-red-400 hover:text-red-500"
                >
                  ✕
                </button>
              )}

            </div>

          </div>

        ))}

      </div>

      {/* FOOTER */}

      <div className="border-t border-white/10 px-4 py-4 shrink-0 bg-[#0f172a]">

        <div className="flex justify-between items-center mb-3">

          <span className="text-sm font-medium">
            Total
          </span>

          <span className="text-sm font-semibold text-emerald-400">
            {total.toLocaleString()} so'm
          </span>

        </div>

        <div className="flex gap-2">

          {/* NORMAL POS MODE */}

          {!isHistoryMode && (

            <>
              <button
                onClick={onLater}
                disabled={!cart.length}
                className="flex-1 rounded-lg py-2 text-sm font-semibold bg-yellow-600 hover:bg-yellow-500 transition"
              >
                Later
              </button>

              <button
                onClick={onPayment}
                disabled={!cart.length}
                className="flex-1 rounded-lg py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 transition"
              >
                Payment
              </button>
            </>

          )}

          {/* HISTORY UNPAID */}

          {isHistoryMode && !isPaid && (

            <button
              onClick={onPayment}
              className="flex-1 rounded-lg py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 transition"
            >
              Payment
            </button>

          )}

          {/* HISTORY PAID */}

          {isPaid && (

            <div className="flex-1 text-center py-2 rounded-lg bg-emerald-700 text-sm font-semibold">
              Paid
            </div>

          )}

        </div>

      </div>

    </div>
  )
}