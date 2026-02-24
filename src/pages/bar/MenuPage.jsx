import { useEffect, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { usePosCart } from "../../modules/bar/domain/usePosCart";

import ActiveClients from "../../components/pos/ActiveClients";
import CategorySidebar from "../../components/bar/ui/CategorySidebar";
import PosProducts from "../../modules/bar/pos/PosProducts";
import CheckoutPanel from "../../components/pos/CheckoutPanel";
import PaymentModal from "../../components/pos/PaymentModal";

const activeClients = [
  { id: "guest", name: "Guest", locker: "-" },
  { id: 1, name: "Client 1", locker: "#12" },
  { id: 2, name: "Client 2", locker: "#13" },
];

export default function MenuPage() {
  const { categories, products, updateProduct } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const pos = usePosCart(products, updateProduct);

  /* ================= AUTO SELECT CATEGORY ================= */

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  /* ================= FILTER PRODUCTS ================= */

  const filteredProducts = selectedCategory
    ? products.filter(
        p =>
          p.categoryId === selectedCategory.id &&
          p.isActive
      )
    : [];

  /* ================= RENDER ================= */

  return (
    <div className="h-full bg-[#0b1220] p-4 flex gap-4 text-white overflow-hidden">

      {/* CLIENTS */}
      <div className="w-52 border border-white/10 rounded-2xl bg-[#0f172a] overflow-hidden">
        <ActiveClients
          clients={activeClients}
          selectedClient={pos.selectedClient}
          onSelect={(client) => {
            pos.setSelectedClient(client);
            pos.resetCart();
          }}
        />
      </div>

      {/* MAIN PANEL */}
      <div className="flex-1 relative flex rounded-2xl border border-white/10 bg-[#0e1628] overflow-hidden">

        {/* CATEGORY */}
        <div className="w-44 border-r border-white/10">
          <CategorySidebar
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* PRODUCTS */}
        <div className="flex-1">
          <PosProducts
            products={filteredProducts}
            selectedClient={pos.selectedClient}
            cart={pos.cart}
            onAdd={pos.addToCart}
          />
        </div>

        {/* CHECKOUT */}
        <div className="w-72 border-l border-white/10 bg-[#111827]">
          <CheckoutPanel
            selectedClient={pos.selectedClient}
            cart={pos.cart}
            total={pos.total}
            onDecrease={pos.decreaseQty}
            onPayment={() => setIsPaymentOpen(true)}   // 🔥 modal ochadi
          />
        </div>

        {/* GLOBAL OVERLAY */}
        {!pos.selectedClient && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-lg font-semibold opacity-90">
              Select Client First
            </div>
          </div>
        )}

      </div>

      {/* 🔥 PAYMENT MODAL */}
      {isPaymentOpen && (
        <PaymentModal
          total={pos.total}
          onClose={() => setIsPaymentOpen(false)}
          onConfirm={(methods) => {
            pos.handlePayment();   // stock update
            setIsPaymentOpen(false);
          }}
        />
      )}
    </div>
  );
}