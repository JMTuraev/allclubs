import { useEffect, useState, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";
import { useSessionsContext } from "../../modules/sessions/domain/SessionsContext";

import {
  collection,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

import { db } from "../../firebase";

import {
  addItemToCheckFastFn,
  decreaseItemFromBarCheckFn
} from "../../firebase";

import ActiveClients from "../../components/pos/ActiveClients";
import CategorySidebar from "../../components/bar/ui/CategorySidebar";
import PosProducts from "../../modules/bar/pos/PosProducts";
import CheckoutPanel from "../../components/pos/CheckoutPanel";
import PaymentModal from "../../components/modals/PaymentModal";

const gymId = "sportzal_demo";

export default function MenuPage() {

  const { categories, products } = useProducts();
  const { sessions } = useSessionsContext();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const [activeCheck, setActiveCheck] = useState(null);
  const [localCart, setLocalCart] = useState([]);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  /* ================= AUTO CATEGORY ================= */

  useEffect(() => {

    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }

  }, [categories, selectedCategory]);

  /* ================= ACTIVE CLIENTS ================= */

  const activeClients = useMemo(() => {

    const list = sessions
      .filter((s) => s.status === "active")
      .map((s) => ({
        id: s.clientId,
        name: s.clientName || "Client",
        locker: s.locker || "-"
      }));

    return [
      { id: "guest", name: "Guest" },
      ...list
    ];

  }, [sessions]);

  /* ================= FILTER PRODUCTS ================= */

  const filteredProducts = useMemo(() => {

    if (!selectedCategory) return [];

    return products.filter(
      (p) =>
        p.categoryId === selectedCategory.id &&
        p.isActive
    );

  }, [products, selectedCategory]);

  /* ================= REALTIME OPEN CHECK ================= */

  useEffect(() => {

    if (!selectedClient) {
      setActiveCheck(null);
      setLocalCart([]);
      return;
    }

    const q = query(
      collection(db, `gyms/${gymId}/barChecks`),
      where("clientId", "==", selectedClient.id),
      where("status", "==", "open")
    );

    const unsub = onSnapshot(q, (snap) => {

      if (snap.empty) {

        setActiveCheck(null);
        setLocalCart([]);

      } else {

        const doc = snap.docs[0];

        const check = {
          id: doc.id,
          ...doc.data()
        };

        setActiveCheck(check);
        setLocalCart(check.items || []);

      }

    });

    return () => unsub();

  }, [selectedClient]);

  /* ================= ADD PRODUCT (FAST POS) ================= */

  const handleAddProduct = async (product) => {

    if (!selectedClient) return;

    /* OPTIMISTIC UI */

    setLocalCart((prev) => {

      const existing = prev.find(
        (i) => i.productId === product.id
      );

      if (existing) {

        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        );

      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          qty: 1,
          price: product.price
        }
      ];

    });

    try {

      const session = sessions.find(
        (s) =>
          s.clientId === selectedClient.id &&
          s.status === "active"
      );

      if (!session) return;

      await addItemToCheckFastFn({
        gymId,
        sessionId: session.id,
        clientId: selectedClient.id,
        productId: product.id
      });

    } catch (err) {

      console.error(err);

    }

  };

  /* ================= DECREASE ================= */

  const handleDecrease = async (productId) => {

    if (!activeCheck) return;

    /* optimistic */

    setLocalCart((prev) => {

      const item = prev.find((i) => i.productId === productId);

      if (!item) return prev;

      if (item.qty === 1) {
        return prev.filter((i) => i.productId !== productId);
      }

      return prev.map((i) =>
        i.productId === productId
          ? { ...i, qty: i.qty - 1 }
          : i
      );

    });

    try {

      await decreaseItemFromBarCheckFn({
        gymId,
        checkId: activeCheck.id,
        productId
      });

    } catch (err) {

      console.error(err);

    }

  };

  /* ================= TOTAL ================= */

  const total = useMemo(() => {

    return localCart.reduce(
      (sum, i) => sum + i.qty * i.price,
      0
    );

  }, [localCart]);

  /* ================= PAYMENT ================= */

  const handleConfirmPayment = () => {

    setIsPaymentOpen(false);

  };

  return (
    <div className="h-full bg-[#0b1220] p-4 flex gap-4 text-white overflow-hidden">

      {/* CLIENTS */}

      <div className="w-52 border border-white/10 rounded-2xl bg-[#0f172a] overflow-hidden">

        <ActiveClients
          clients={activeClients}
          selectedClient={selectedClient}
          onSelect={(client) => setSelectedClient(client)}
        />

      </div>

      {/* MAIN */}

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
            cart={localCart}
            onAdd={handleAddProduct}
          />

        </div>

        {/* CHECKOUT */}

        <div className="w-72 border-l border-white/10 bg-[#111827]">

          <CheckoutPanel
            selectedClient={selectedClient}
            cart={localCart}
            total={total}
            onDecrease={handleDecrease}
            onPayment={() => setIsPaymentOpen(true)}
          />

        </div>

        {!selectedClient && (

          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="text-lg font-semibold opacity-90">
              Select Client First
            </div>

          </div>

        )}

      </div>

      {isPaymentOpen && (

        <PaymentModal
          total={total}
          client={{ name: selectedClient?.name }}
          checkNumber={`BAR-${Date.now()}`}
          onClose={() => setIsPaymentOpen(false)}
          onConfirm={handleConfirmPayment}
        />

      )}

    </div>
  );
}