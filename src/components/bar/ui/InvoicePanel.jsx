export default function InvoicePanel({
  invoiceItems = [],
  invoiceNumber,
  today,
  invoiceTotal = 0,
  onQtyChange,
  onPriceChange,
  onRemove,
  onSave
}) {

  return (
    <div className="w-full h-full bg-[#111827] rounded-xl flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="p-3 border-b border-gray-800 flex justify-between text-xs text-gray-400 shrink-0">
        <div>
          <div>Incoming Invoice</div>
          <div className="text-gray-500">{invoiceNumber}</div>
        </div>
        <div>{today}</div>
      </div>

      {/* ITEMS */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {invoiceItems.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-6">
            No products added
          </div>
        )}

        {invoiceItems.map(item => {

          const priceNumber = Number(item.purchasePrice) || 0;
          const lineTotal = (item.quantity || 0) * priceNumber;

          return (
            <div
              key={item.id}
              className="bg-[#1F2937] rounded-md p-2 flex items-center gap-3"
            >

              {/* NAME */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {item.name}
                </div>

                <div className="text-[11px] text-gray-500">
                  Selling: {item.price?.toLocaleString()} so'm
                </div>
              </div>

              {/* QTY */}
              <input
                type="number"
                min="1"
                value={item.quantity || 1}
                onChange={(e) =>
                  onQtyChange?.(item.id, e.target.value)
                }
                className="w-14 bg-[#0B1120] rounded px-2 py-1 text-xs text-center outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {/* PURCHASE PRICE */}
              <input
                type="number"
                min="0"
                placeholder="Price"
                value={item.purchasePrice || ""}
                onChange={(e) =>
                  onPriceChange?.(item.id, e.target.value)
                }
                className="w-24 bg-[#0B1120] rounded px-2 py-1 text-xs text-center outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {/* LINE TOTAL */}
              <div className="w-24 text-right text-sm font-medium">
                {lineTotal > 0
                  ? lineTotal.toLocaleString() + " so'm"
                  : ""}
              </div>

              {/* REMOVE */}
              <button
                onClick={() => onRemove?.(item.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ✕
              </button>

            </div>
          );

        })}

      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-800 p-3 shrink-0">

        <div className="flex justify-between items-center">

          <div>
            <div className="text-xs text-gray-400">
              Total
            </div>

            <div className="text-lg font-bold">
              {invoiceTotal.toLocaleString()} so'm
            </div>
          </div>

          <button
            onClick={onSave}
            disabled={!invoiceItems.length}
            className={`px-6 py-2 rounded-md text-sm font-medium transition ${
              invoiceItems.length
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}