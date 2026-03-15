import { useEffect, useState, useMemo } from "react";
import { useProducts } from "../../context/ProductContext";
import { useSessionsContext } from "../../modules/sessions/domain/SessionsContext";
import { useClientsContext } from "../../modules/clients/domain/ClientsContext";

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

import {
  createLaterCheck,
  payCheck
} from "../../modules/bar/domain/barChecks";

import ActiveClients from "../../components/pos/ActiveClients";
import CategorySidebar from "../../components/bar/ui/CategorySidebar";
import PosProducts from "../../modules/bar/pos/PosProducts";
import CheckoutPanel from "../../components/pos/CheckoutPanel";
import PaymentModal from "../../components/modals/PaymentModal";

const gymId = "sportzal_demo";

export default function MenuPage() {

  const { categories, products } = useProducts();
  const { sessions } = useSessionsContext();
  const { clients } = useClientsContext();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const [localCart, setLocalCart] = useState([]);
  const [checks, setChecks] = useState([]);
  const [selectedCheckId, setSelectedCheckId] = useState(null);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  /* AUTO CATEGORY */

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  /* ACTIVE CLIENTS */

  const activeClients = useMemo(() => {

    const list = sessions
      .filter((s) => s.status === "active")
      .map((s) => {

        const client = clients.find(
          (c) => String(c.id) === String(s.clientId)
        );

        return {
          id: s.clientId,
          name: client
            ? `${client.firstName} ${client.lastName}`
            : "Client",
          locker: s.locker || "-"
        };

      });

    return [
      { id: "guest", name: "Guest" },
      ...list
    ];

  }, [sessions, clients]);

  /* CURRENT SESSION */

  const activeSession = useMemo(() => {

    if (!selectedClient) return null;

    return sessions.find(
      (s) =>
        s.clientId === selectedClient.id &&
        s.status === "active"
    );

  }, [sessions, selectedClient]);

  /* SESSION CHANGE RESET */

  useEffect(() => {

    setSelectedCheckId(null);
    setLocalCart([]);

  }, [activeSession]);

  /* FILTER PRODUCTS */

  const filteredProducts = useMemo(() => {

    if (!selectedCategory) return [];

    return products.filter(
      (p) =>
        p.categoryId === selectedCategory.id &&
        p.isActive
    );

  }, [products, selectedCategory]);

  /* REALTIME CHECKS */

  useEffect(() => {

    if (!activeSession) {
      setChecks([]);
      return;
    }

    const q = query(
      collection(db, `gyms/${gymId}/barChecks`),
      where("sessionId", "==", activeSession.id)
    );

    const unsub = onSnapshot(q, (snap) => {

      const list = snap.docs
        .map(d => ({
          id: d.id,
          ...d.data()
        }))
        .filter(
          c =>
            c.status === "later" ||
            c.status === "unpaid"
        );

      console.log("checks:", list);

      setChecks(list);

    });

    return () => unsub();

  }, [activeSession]);

  /* LOAD CHECK ITEMS */

  useEffect(() => {

    if (!selectedCheckId) return;

    const unsub = onSnapshot(
      collection(
        db,
        `gyms/${gymId}/barChecks/${selectedCheckId}/items`
      ),
      snap => {

        const items = snap.docs.map(d => ({
          id: d.id,
          productId: d.data().productId,
          name: d.data().name,
          qty: d.data().qty,
          price: d.data().price
        }));

        setLocalCart(items);

      }
    );

    return () => unsub();

  }, [selectedCheckId]);

  /* ADD PRODUCT */

  const handleAddProduct = async (product) => {

    if (!activeSession) return;

    setSelectedCheckId(null);

    setLocalCart(prev => {

      const existing = prev.find(
        i => i.productId === product.id
      );

      if (existing) {

        return prev.map(i =>
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

      await addItemToCheckFastFn({
        gymId,
        sessionId: activeSession.id,
        clientId: selectedClient.id,
        productId: product.id
      });

    } catch (err) {
      console.error(err);
    }

  };

  /* DECREASE */

  const handleDecrease = async (productId) => {

    const item = localCart.find(
      i => i.productId === productId
    );

    if (!item) return;

    setLocalCart(prev => {

      if (item.qty === 1) {
        return prev.filter(
          i => i.productId !== productId
        );
      }

      return prev.map(i =>
        i.productId === productId
          ? { ...i, qty: i.qty - 1 }
          : i
      );

    });

    try {

      await decreaseItemFromBarCheckFn({
        gymId,
        checkId: selectedCheckId,
        productId
      });

    } catch (err) {
      console.error(err);
    }

  };

  /* TOTAL */

  const total = useMemo(() => {

    return localCart.reduce(
      (sum, i) => sum + i.qty * i.price,
      0
    );

  }, [localCart]);

  /* LATER */

  const handleLater = async () => {

    if (!activeSession || localCart.length === 0) return;

    try {

      await createLaterCheck(
        selectedClient.id,
        activeSession.id,
        localCart,
        total
      );

      setLocalCart([]);

    } catch (err) {
      console.error(err);
    }

  };

  /* PAYMENT */

  const handleConfirmPayment = async () => {

    if (!activeSession || localCart.length === 0) return;

    try {

      const checkId = await createLaterCheck(
        selectedClient.id,
        activeSession.id,
        localCart,
        total
      );

      await payCheck(
        checkId,
        total,
        ["cash"],
        selectedClient.id,
        activeSession.id
      );

      setLocalCart([]);
      setIsPaymentOpen(false);

    } catch (err) {
      console.error(err);
    }

  };

  return (
    <div className="h-full bg-[#0b1220] p-4 flex gap-4 text-white overflow-hidden">

      <div className="w-52 border border-white/10 rounded-2xl bg-[#0f172a] overflow-hidden">

        <ActiveClients
          clients={activeClients}
          selectedClient={selectedClient}
          onSelect={setSelectedClient}
        />

      </div>

      <div className="flex-1 relative flex rounded-2xl border border-white/10 bg-[#0e1628] overflow-hidden">

        <div className="w-44 border-r border-white/10">

          <CategorySidebar
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

        </div>

        <div className="flex-1">

          <PosProducts
            products={filteredProducts}
            selectedClient={selectedClient}
            cart={localCart}
            onAdd={handleAddProduct}
          />

        </div>

        <div className="w-72 border-l border-white/10 bg-[#111827]">

          <CheckoutPanel
            selectedClient={selectedClient}
            cart={localCart}
            total={total}
            onDecrease={handleDecrease}
            onPayment={() => setIsPaymentOpen(true)}
            onLater={handleLater}

            checks={checks}
            selectedCheckId={selectedCheckId}
            onSelectCheck={setSelectedCheckId}
          />

        </div>

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