import { BellIcon } from "@heroicons/react/24/outline";

export default function CheckoutPanel({
  selectedClient,
  cart,
  total,
  onDecrease,
}) {
  return (
    <div className="w-80 border-l border-white/10 bg-[#0f172a] flex flex-col">

      {/* HEADER (minimal) */}
      <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <div className="text-sm font-semibold">
          {selectedClient?.locker
            ? `Check ${selectedClient.locker}`
            : "Check #—"}
        </div>

        <BellIcon className="w-4 h-4 text-gray-400" />
      </div>

      {/* CART LIST */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 space-y-6 custom-scroll">

        {cart.map((item) => (
          <div key={item.id} className="relative">

            {/* CARD */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {item.qty} × {item.price}
                  </div>
                </div>

                <div className="text-sm font-semibold whitespace-nowrap">
                  {(item.qty * item.price).toLocaleString()}
                </div>
              </div>
            </div>

            {/* FLOATING BADGE */}
            <button
              onClick={() => onDecrease(item.id)}
              className="
                absolute
                -top-2
                -right-2
                w-6
                h-6
                bg-indigo-600
                text-white
                text-[11px]
                rounded-full
                flex
                items-center
                justify-center
                shadow-lg
                hover:bg-indigo-500
                transition
              "
            >
              {item.qty}
            </button>

          </div>
        ))}

      </div>

      {/* TOTAL + PAYMENT */}
      <div className="px-6 py-6 border-t border-white/10">
        <div className="flex justify-between text-base font-semibold mb-6">
          <span>Total</span>
          <span className="text-green-400">
            {total.toLocaleString()} so'm
          </span>
        </div>

        <button className="w-full bg-green-600 py-3 rounded-xl text-sm font-semibold hover:bg-green-500 transition">
          Payment
        </button>
      </div>

      {/* DARK SCROLL */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}