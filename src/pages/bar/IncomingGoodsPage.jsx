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
    addToInvoice,
    updateQuantity,
    updatePurchasePrice,
    removeItem
  } = useBar();

  const invoiceNumber =
    "INC-" + Date.now().toString().slice(-6);

  const today =
    new Date().toISOString().split("T")[0];

  return (
    <div className="h-full flex gap-4 p-4 bg-[#0B1120] text-white overflow-hidden">

      {/* CATEGORY */}
      <div className="w-56 bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* PRODUCTS */}
      <div className="flex-1 bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden">
        <IncomingProducts
          products={filteredProducts}
          onAdd={addToInvoice}
        />
      </div>

      {/* INVOICE */}
      <div className="w-80 bg-[#0e1628] border border-white/10 rounded-2xl overflow-hidden">
        <InvoicePanel
          invoiceItems={invoiceItems}
          invoiceNumber={invoiceNumber}
          today={today}
          invoiceTotal={invoiceTotal}
          onQtyChange={updateQuantity}
          onPriceChange={updatePurchasePrice}
          onRemove={removeItem}
          onSave={() => alert("Saved")}
        />
      </div>

    </div>
  );
}