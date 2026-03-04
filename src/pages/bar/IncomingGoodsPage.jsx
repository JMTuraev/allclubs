import { useMemo } from "react";
import { useBar } from "../../context/bar/BarContext";

import CategorySidebar from "../../components/bar/ui/CategorySidebar";
import IncomingProducts from "../../modules/bar/incoming/IncomingProducts";
import InvoicePanel from "../../components/bar/ui/InvoicePanel";

export default function IncomingGoodsPage() {

  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,

    invoiceItems,
    invoiceTotal,

    addToIncomingInvoice,
    updateQuantity,
    updatePurchasePrice,
    removeItem,
    saveIncomingInvoice
  } = useBar();

  /* ================= STABLE VALUES ================= */

  const invoiceNumber = useMemo(() => {
    return "INC-" + Date.now().toString().slice(-6);
  }, []);

  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  /* ================= RENDER ================= */

  return (
    <div className="h-full flex gap-4 p-4 bg-[#0B1120] text-white overflow-hidden">

      {/* CATEGORY SIDEBAR */}

      <div className="w-48 bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden">
        <CategorySidebar
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* PRODUCT SELECT */}

      <div className="flex-[1] bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden">
        <IncomingProducts
          products={filteredProducts}
          onAdd={addToIncomingInvoice}
        />
      </div>

      {/* INVOICE PANEL */}

      <div className="flex-[1.4] bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden">
        <InvoicePanel
          invoiceItems={invoiceItems}
          invoiceNumber={invoiceNumber}
          today={today}
          invoiceTotal={invoiceTotal}
          onQtyChange={updateQuantity}
          onPriceChange={updatePurchasePrice}
          onRemove={removeItem}
          onSave={saveIncomingInvoice}
        />
      </div>

    </div>
  );
}