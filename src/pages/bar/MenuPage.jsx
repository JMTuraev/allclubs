import { useEffect, useState } from "react";
import { useProducts } from "../../context/ProductContext";
import { usePosCart } from "../../modules/bar/domain/usePosCart";
import { useTransactions } from "../../context/transaction/TransactionContext";

import ActiveClients from "../../components/pos/ActiveClients";
import CategorySidebar from "../../components/bar/ui/CategorySidebar";
import PosProducts from "../../modules/bar/pos/PosProducts";
import CheckoutPanel from "../../components/pos/CheckoutPanel";
import PaymentModal from "../../components/modals/PaymentModal";

const activeClients = [
  { id: "guest", name: "Guest", locker: "-" },
  { id: 1, name: "Client 1", locker: "#12" },
  { id: 2, name: "Client 2", locker: "#13" },
];

export default function MenuPage() {
  const { categories, products, updateProduct } = useProducts();
  const { addTransaction } = useTransactions();

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

  /* ================= HANDLE PAYMENT ================= */

  const handleConfirmPayment = (paymentData) => {

    // 1️⃣ SERVICE TRANSACTION (bar sotuv)
    addTransaction({
      type: "service",
      category: "bar",
      clientId: pos.selectedClient?.id || null,
      amount: pos.total,
      meta: {
        items: pos.cart.map(item => ({
          productId: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price
        }))
      }
    });

    // 2️⃣ PAYMENT TRANSACTIONS (split)
    Object.entries(paymentData.methods).forEach(([method, amount]) => {
      if (Number(amount) > 0) {
        addTransaction({
          type: "payment",
          category: "bar",
          clientId: pos.selectedClient?.id || null,
          amount: Number(amount),
          paymentMethod: method,
          comment: paymentData.comment
        });
      }
    });

    // 3️⃣ STOCK UPDATE
    pos.handlePayment();

    // 4️⃣ CLOSE MODAL
    setIsPaymentOpen(false);
  };

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
            onPayment={() => setIsPaymentOpen(true)}
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

      {/* PAYMENT MODAL */}
      {isPaymentOpen && (
        <PaymentModal
          total={pos.total}
          client={{ name: pos.selectedClient?.name }}
          checkNumber={`BAR-${Date.now()}`}
          onClose={() => setIsPaymentOpen(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}