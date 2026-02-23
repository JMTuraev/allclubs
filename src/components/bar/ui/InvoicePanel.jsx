export default function InvoicePanel({
  invoiceItems,
  invoiceNumber,
  today,
  invoiceTotal,
  onQtyChange,
  onPriceChange,
  onRemove,
  onSave
}) {
  return (
    <div className="w-full h-full bg-[#111827] rounded-xl flex flex-col overflow-hidden">

      <div className="p-3 border-b border-gray-800 flex justify-between text-xs text-gray-400 shrink-0">
        <div>
          <div>Incoming Invoice</div>
          <div className="text-gray-500">{invoiceNumber}</div>
        </div>
        <div>{today}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {invoiceItems.map(item => {
          const lineTotal =
            item.quantity > 0 && item.purchasePrice > 0
              ? item.quantity * item.purchasePrice
              : null;

          return (
            <div
              key={item.id}
              className="bg-[#1F2937] rounded-md p-2 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {item.name}
                </div>
                <div className="text-[11px] text-gray-500">
                  Selling: {item.price?.toLocaleString()} so'm
                </div>
              </div>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  onQtyChange(item.id, Number(e.target.value))
                }
                className="w-14 bg-[#0B1120] rounded px-2 py-1 text-xs text-center"
              />

              <input
                type="number"
                min="0"
                placeholder="Price"
                value={item.purchasePrice || ""}
                onChange={(e) =>
                  onPriceChange(item.id, Number(e.target.value))
                }
                className="w-24 bg-[#0B1120] rounded px-2 py-1 text-xs text-center"
              />

              <div className="w-24 text-right text-sm font-medium">
                {lineTotal
                  ? lineTotal.toLocaleString() + " so'm"
                  : ""}
              </div>

              <button
                onClick={() => onRemove(item.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-800 p-3 shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-400">Total</div>
            <div className="text-lg font-bold">
              {invoiceTotal.toLocaleString()} so'm
            </div>
          </div>

          <button
            onClick={onSave}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md text-sm font-medium transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}