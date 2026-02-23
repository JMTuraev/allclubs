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
  const { categories, products } = useProducts();

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredProducts = selectedCategory
    ? products.filter(
        p =>
          p.categoryId === selectedCategory.id &&
          p.isActive
      )
    : [];

  const addToCart = (product) => {
    if (!selectedClient) return;

    const existing = cart.find(i => i.id === product.id);

    if (existing) {
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

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="h-full bg-[#0b1220] p-4 flex gap-4 text-white overflow-hidden">

      {/* ACTIVE CLIENTS */}
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

      {/* MAIN POS PANEL */}
      <div className="flex-1 flex rounded-2xl border border-white/10 bg-[#0e1628] overflow-hidden">

        {/* CATEGORY */}
        <div className="w-44 border-r border-white/10">
          <CategorySidebar
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* PRODUCTS */}
        <div className="flex-1 relative">
          <PosProducts
            products={filteredProducts}
            selectedClient={selectedClient}
            cart={cart}
            onAdd={addToCart}
          />

          {!selectedClient && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="text-base font-semibold opacity-80">
                Select Client First
              </div>
            </div>
          )}
        </div>

        {/* CHECKOUT */}
        <div className="w-72 border-l border-white/10 bg-[#111827]">
          <CheckoutPanel
            selectedClient={selectedClient}
            cart={cart}
            total={total}
            onDecrease={decreaseQty}
          />
        </div>

      </div>
    </div>
  );
}