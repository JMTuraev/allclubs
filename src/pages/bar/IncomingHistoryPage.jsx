import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

import {
  db,
  deleteBarIncomingFn
} from "../../firebase";

import {
  ChevronDownIcon,
  ArchiveBoxIcon
} from "@heroicons/react/24/outline";

const gymId = "sportzal_demo";

export default function IncomingHistoryPage() {

  const [invoices, setInvoices] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {

    const q = query(
      collection(db, `gyms/${gymId}/barIncoming`),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, snap => {

      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setInvoices(list);

    });

    return () => unsub();

  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (e, id) => {

    e.stopPropagation();

    const ok = window.confirm("Delete this invoice?");
    if (!ok) return;

    try {

      await deleteBarIncomingFn({
        gymId,
        incomingId: id
      });

    } catch (err) {

      console.error(err);
      alert(err.message);

    }

  };

  /* ================= EMPTY STATE ================= */

  if (!invoices.length) {
    return (

      <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">

        <ArchiveBoxIcon className="w-20 h-20 mb-4 text-gray-500" />

        <h2 className="text-lg font-semibold text-gray-300">
          No incoming invoices
        </h2>

        <p className="text-sm mt-1">
          Your stock entries will appear here
        </p>

      </div>

    );
  }

  return (
    <div className="h-full p-4 bg-[#0b1220] text-white overflow-auto">

      <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">

        {/* HEADER */}

        <div className="grid grid-cols-6 px-4 py-3 text-xs text-gray-400 border-b border-white/10">
          <div>#</div>
          <div>Invoice</div>
          <div>Date</div>
          <div>Products</div>
          <div>Qty</div>
          <div>Total</div>
        </div>

        {/* LIST */}

        {invoices.map((inv, index) => {

          const totalQty =
            inv.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

          const productCount =
            inv.items?.length || 0;

          const date =
            inv.createdAt?.toDate?.()
              ?.toLocaleString() || "";

          const isOpen = openId === inv.id;

          return (
            <div key={inv.id}>

              {/* ROW */}

              <div
                onClick={() =>
                  setOpenId(isOpen ? null : inv.id)
                }
                className="grid grid-cols-6 items-center px-4 py-3 text-sm border-b border-white/5 hover:bg-white/5 cursor-pointer"
              >

                <div className="flex items-center gap-2">

                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />

                  {index + 1}

                </div>

                <div className="font-medium text-indigo-400">
                  {inv.invoiceNumber}
                </div>

                <div className="text-gray-400 text-xs">
                  {date}
                </div>

                <div>
                  <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md text-xs">
                    {productCount} items
                  </span>
                </div>

                <div>
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md text-xs">
                    {totalQty}
                  </span>
                </div>

                <div className="font-semibold">
                  {(inv.total || 0).toLocaleString()} so'm
                </div>

              </div>

              {/* DROPDOWN */}

              {isOpen && (

                <div className="bg-black/30 px-6 py-5">

                  <div className="bg-[#111827] border border-white/10 rounded-xl p-4 space-y-3">

                    {inv.items?.map(item => {

                      const line =
                        item.quantity * item.purchasePrice;

                      return (

                        <div
                          key={item.productId}
                          className="flex justify-between items-center text-sm border-b border-white/5 pb-2"
                        >

                          <div className="flex flex-col">

                            <span className="font-medium">
                              {item.name || "Unknown product"}
                            </span>

                            <span className="text-gray-400 text-xs">
                              {item.purchasePrice.toLocaleString()} so'm
                            </span>

                          </div>

                          <div className="flex items-center gap-4">

                            <span className="text-gray-400">
                              x{item.quantity}
                            </span>

                            <span className="font-semibold">
                              {line.toLocaleString()} so'm
                            </span>

                          </div>

                        </div>

                      );

                    })}

                    {/* TOTAL */}

                    <div className="flex justify-between pt-3 text-sm font-semibold">

                      <span>Total</span>

                      <span>
                        {(inv.total || 0).toLocaleString()} so'm
                      </span>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4 pt-3">

                    <button
                      onClick={(e) => handleDelete(e, inv.id)}
                      className="text-red-400 text-xs hover:text-red-300"
                    >
                      Delete
                    </button>

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