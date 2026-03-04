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
  getOrCreateOpenBarCheckFn,
  addItemToBarCheckFn,
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
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  /* ================= AUTO CATEGORY ================= */

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  /* ================= FILTER PRODUCTS ================= */

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter(
      p =>
        p.categoryId === selectedCategory.id &&
        p.isActive
    );
  }, [products, selectedCategory]);

  /* ================= REALTIME OPEN CHECK ================= */

  useEffect(() => {
    if (!selectedClient) {
      setActiveCheck(null);
      return;
    }

    const q = query(
      collection(db, `gyms/${gymId}/barChecks`),
      where("clientId", "==", selectedClient.id),
      where("status", "==", "open")
    );

    const unsub = onSnapshot(q, snap => {
      if (snap.empty) {
        setActiveCheck(null);
      } else {
        const doc = snap.docs[0];
        setActiveCheck({
          id: doc.id,
          ...doc.data()
        });
      }
    });

    return () => unsub();
  }, [selectedClient]);

  /* ================= ADD PRODUCT ================= */

  const handleAddProduct = async (product) => {
    if (!selectedClient) return;

    try {
      const session = sessions.find(
        s =>
          s.clientId === selectedClient.id &&
          s.status === "active"
      );

      if (!session) return; // guest keyin

      const res = await getOrCreateOpenBarCheckFn({
        gymId,
        sessionId: session.id,
        clientId: selectedClient.id
      });

      const checkId = res.data.checkId;

      await addItemToBarCheckFn({
        gymId,
        checkId,
        productId: product.id,
        quantity: 1
      });

    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= DECREASE ITEM ================= */

const handleDecrease = async (productId) => {
  if (!activeCheck) return;

  try {
    await decreaseItemFromBarCheckFn({
      gymId,
      checkId: activeCheck.id,
      productId
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


  /* ================= HANDLE PAYMENT (TEMPORARY) ================= */

  const handleConfirmPayment = () => {
    setIsPaymentOpen(false);
    // payment backend keyingi step
  };

  return (
    <div className="h-full bg-[#0b1220] p-4 flex gap-4 text-white overflow-hidden">

      {/* CLIENTS */}
      <div className="w-52 border border-white/10 rounded-2xl bg-[#0f172a] overflow-hidden">
        <ActiveClients
          selectedClient={selectedClient}
          onSelect={(client) => {
            setSelectedClient(client);
          }}
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
            cart={activeCheck?.items || []}
            onAdd={handleAddProduct}
          />
        </div>

        {/* CHECKOUT */}
        <div className="w-72 border-l border-white/10 bg-[#111827]">
         <CheckoutPanel
  selectedClient={selectedClient}
  cart={activeCheck?.items || []}
  total={activeCheck?.total || 0}
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
          total={activeCheck?.total || 0}
          client={{ name: selectedClient?.name }}
          checkNumber={`BAR-${Date.now()}`}
          onClose={() => setIsPaymentOpen(false)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}