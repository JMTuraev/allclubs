import { useState, useMemo } from "react";

export function usePosCart(products, updateProduct) {
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  /* ================= ADD ================= */

  const addToCart = (product) => {
    if (!selectedClient || product.stock <= 0) return;

    const existing = cart.find(i => i.id === product.id);

    if (existing) {
      if (existing.qty >= product.stock) return;

      setCart(prev =>
        prev.map(i =>
          i.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );
    } else {
      setCart(prev => [...prev, { ...product, qty: 1 }]);
    }
  };

  /* ================= DECREASE ================= */

  const decreaseQty = (id) => {
    const existing = cart.find(i => i.id === id);
    if (!existing) return;

    if (existing.qty === 1) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev =>
        prev.map(i =>
          i.id === id
            ? { ...i, qty: i.qty - 1 }
            : i
        )
      );
    }
  };

  /* ================= TOTAL ================= */

  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [cart]);

  /* ================= PAYMENT ================= */

  const handlePayment = () => {
    if (!cart.length) return;

    // Stock validation
    for (let item of cart) {
      const product = products.find(p => p.id === item.id);
      if (!product || product.stock < item.qty) {
        alert(`${item.name} yetarli emas`);
        return;
      }
    }

    // Stock update
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return;

      updateProduct(item.id, {
        stock: product.stock - item.qty
      });
    });

    // Clear cart
    setCart([]);
  };

  const resetCart = () => setCart([]);

  return {
    cart,
    total,
    selectedClient,
    setSelectedClient,
    addToCart,
    decreaseQty,
    handlePayment,
    resetCart
  };
}