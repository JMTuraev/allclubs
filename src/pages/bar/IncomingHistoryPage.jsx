import { useState } from "react";
import { useBar } from "../../context/bar/BarContext";

export default function IncomingHistoryPage() {

  const { incomingInvoices } = useBar();
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="p-6 text-white">

      <h2 className="text-xl font-semibold mb-6">
        Incoming History
      </h2>

      {incomingInvoices.length === 0 && (
        <div className="text-gray-400">
          No invoices yet.
        </div>
      )}

      <div className="space-y-4">

        {incomingInvoices.map((invoice) => {
          const isOpen = expandedId === invoice.id;

          return (
            <div
              key={invoice.id}
              className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden"
            >

              <div
                onClick={() =>
                  setExpandedId(isOpen ? null : invoice.id)
                }
                className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-white/5"
              >
                <div className="flex gap-10 items-center">

                  <div>
                    <div className="text-indigo-400 font-semibold">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="text-xs text-gray-400">
                      {invoice.date}
                    </div>
                  </div>

                  <div className="text-gray-300">
                    {invoice.items.length} items
                  </div>

                  <div className="text-green-400 font-semibold">
                    {invoice.total.toLocaleString()} so'm
                  </div>

                </div>
              </div>

              {isOpen && (
                <div className="px-6 pb-6 border-t border-gray-800 bg-[#0F172A]">
                  <div className="mt-4 space-y-3">

                    {invoice.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm text-gray-300"
                      >
                        <div>{item.name}</div>
                        <div>
                          {item.quantity} x{" "}
                          {item.purchasePrice?.toLocaleString?.() || 0} so'm
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold">
                      <div>Total</div>
                      <div>
                        {invoice.total.toLocaleString()} so'm
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}