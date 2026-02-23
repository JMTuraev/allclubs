import { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";

import ActiveClients from "../components/pos/ActiveClients";
import CategoriesColumn from "../components/pos/CategoriesColumn";
import ProductGrid from "../components/pos/ProductGrid";
import CheckoutPanel from "../components/pos/CheckoutPanel";

const activeClients = [
  { id: "guest", name: "Guest", locker: "-" },
  { id: 1, name: "Client 1", locker: "#12" },
  { id: 2, name: "Client 2", locker: "#13" },
];

export default function MenuPage() {
  const { categories, products } = useProducts();

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

  /* ===== AUTO SELECT FIRST CATEGORY ===== */
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  /* ===== FILTER PRODUCTS ===== */
  const filteredProducts = selectedCategory
    ? products.filter(
        (p) =>
          p.categoryId === selectedCategory.id &&
          p.isActive
      )
    : [];

  /* ===== CART LOGIC ===== */
  const addToCart = (product) => {
    if (!selectedClient) return;

    const existing = cart.find((i) => i.id === product.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const decreaseQty = (id) => {
    const existing = cart.find((i) => i.id === id);
    if (!existing) return;

    if (existing.qty === 1) {
      setCart(cart.filter((i) => i.id !== id));
    } else {
      setCart(
        cart.map((i) =>
          i.id === id
            ? { ...i, qty: i.qty - 1 }
            : i
        )
      );
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="h-screen bg-[#0b1220] p-4 flex gap-4 text-white overflow-hidden">

      {/* ===== ACTIVE CLIENTS ===== */}
      <div className="w-56 border border-white/10 rounded-2xl bg-[#0f172a]">
        <ActiveClients
          clients={activeClients}
          selectedClient={selectedClient}
          onSelect={(client) => {
            setSelectedClient(client);
            setCart([]);
          }}
        />
      </div>

      {/* ===== POS PANEL ===== */}
      <div className="relative flex-1 rounded-2xl border border-white/10 bg-[#0e1628] overflow-hidden flex">

        {/* CLEAN CATEGORY COLUMN */}
        <CategoriesColumn
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          adminMode={false}
        />

        <ProductGrid
          products={filteredProducts}
          selectedClient={selectedClient}
          cart={cart}
          onAdd={addToCart}
          onDecrease={decreaseQty}
        />

        <CheckoutPanel
          selectedClient={selectedClient}
          cart={cart}
          total={total}
          onDecrease={decreaseQty}
        />

        {!selectedClient && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            Select Client First
          </div>
        )}

      </div>
    </div>
  );
}