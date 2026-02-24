export default function CheckoutPanel({
  selectedClient,
  cart,
  total,
  onDecrease,
  onPayment
}) {
  return (
    <div className="h-full flex flex-col">

      <div className="px-4 py-3 border-b border-white/10 shrink-0">
        <div className="text-sm font-semibold">
          Check {selectedClient ? `#${selectedClient.locker}` : "-"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

        {cart.length === 0 && (
          <div className="text-xs text-gray-500">
            No items
          </div>
        )}

        {cart.map(item => (
          <div
            key={item.id}
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

              <button
                onClick={() => onDecrease(item.id)}
                className="text-xs text-red-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

      </div>

      <div className="border-t border-white/10 px-4 py-4 shrink-0 bg-[#0f172a]">

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">
            Total
          </span>

          <span className="text-sm font-semibold text-emerald-400">
            {total.toLocaleString()} so'm
          </span>
        </div>

        <button
          onClick={onPayment}
          disabled={!cart.length}
          className={`w-full rounded-lg py-2 text-sm font-semibold transition ${
            cart.length
              ? "bg-emerald-600 hover:bg-emerald-500"
              : "bg-white/10 text-gray-500 cursor-not-allowed"
          }`}
        >
          Payment
        </button>

      </div>
    </div>
  );
}