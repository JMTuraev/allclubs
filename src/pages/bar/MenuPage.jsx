import { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";

import ActiveClients from "../../components/pos/ActiveClients";
import CategorySidebar from "../../components/bar/ui/CategorySidebar";
import PosProducts from "../../modules/bar/pos/PosProducts";
import CheckoutPanel from "../../components/pos/CheckoutPanel";

const activeClients = [
  { id: "guest", name: "Guest", locker: "-" },
  { id: 1, name: "Client 1", locker: "#12" },
  { id: 2, name: "Client 2", locker: "#13" },
];

export default function MenuPage() {
  const { categories, products, updateProduct } = useProducts();

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

  /* ================= AUTO SELECT FIRST CATEGORY ================= */

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

  /* ================= ADD TO CART ================= */

  const addToCart = (product) => {
    if (!selectedClient || product.stock <= 0) return;

    const existing = cart.find(i => i.id === product.id);

    if (existing) {
      if (existing.qty >= product.stock) return; // stock limit

      setCart(
        cart.map(i =>
          i.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  /* ================= DECREASE ================= */

  const decreaseQty = (id) => {
    const existing = cart.find(i => i.id === id);
    if (!existing) return;

    if (existing.qty === 1) {
      setCart(cart.filter(i => i.id !== id));
    } else {
      setCart(
        cart.map(i =>
          i.id === id
            ? { ...i, qty: i.qty - 1 }
            : i
        )
      );
    }
  };

  /* ================= TOTAL ================= */

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ================= PAYMENT ================= */

  const handlePayment = () => {
    if (!cart.length) return;

    // 1️⃣ Stock check
    for (let item of cart) {
      const product = products.find(p => p.id === item.id);
      if (!product || product.stock < item.qty) {
        alert(`${item.name} yetarli emas`);
        return;
      }
    }

    // 2️⃣ Stock kamaytirish
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;

      updateProduct(item.id, {
        stock: product.stock - item.qty
      });
    });

    // 3️⃣ Cart tozalash
    setCart([]);
  };

  /* ================= RENDER ================= */

  return (
    <div className="h-full bg-[#0b1220] p-4 flex gap-4 text-white overflow-hidden">

      {/* CLIENTS */}
      <div className="w-52 border border-white/10 rounded-2xl bg-[#0f172a] overflow-hidden">
        <ActiveClients
          clients={activeClients}
          selectedClient={selectedClient}
          onSelect={(client) => {
            setSelectedClient(client);
            setCart([]);
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
            selectedClient={selectedClient}
            cart={cart}
            onAdd={addToCart}
          />
        </div>

        {/* CHECKOUT */}
        <div className="w-72 border-l border-white/10 bg-[#111827]">
          <CheckoutPanel
            selectedClient={selectedClient}
            cart={cart}
            total={total}
            onDecrease={decreaseQty}
            onPayment={handlePayment}
          />
        </div>

        {/* 🔥 GLOBAL OVERLAY */}
        {!selectedClient && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-lg font-semibold opacity-90">
              Select Client First
            </div>
          </div>
        )}

      </div>
    </div>
  );
}