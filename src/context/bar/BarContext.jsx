import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useProducts } from "../ProductContext";

import {
  getOrCreateOpenCheck,
  addItemToCheck,
  payCheck,
  subscribeCheckItems
} from "../../modules/bar/domain/barChecks";

import { useBarInvoice } from "../../modules/bar/domain/useBarInvoice";

import { createBarIncomingFn } from "../../firebase";

const BarContext = createContext();
export const useBar = () => useContext(BarContext);

const gymId = "sportzal_demo";

export function BarProvider({ children }) {

  const { categories, products } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoryId === selectedCategory.id)
    : [];

  /* ================= POS STATE ================= */

  const [activeCheckId, setActiveCheckId] = useState(null);
  const [checkItems, setCheckItems] = useState([]);

  const unsubscribeRef = useRef(null);

  /* ================= REALTIME LISTENER ================= */

  useEffect(() => {

    if (!activeCheckId) return;

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    unsubscribeRef.current = subscribeCheckItems(
      activeCheckId,
      setCheckItems
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };

  }, [activeCheckId]);

  /* ================= INCOMING STATE ================= */

  const invoice = useBarInvoice();

  /* ================= POS PRODUCT CLICK ================= */

  const addToPosInvoice = async (product, clientId, sessionId) => {

    if (!product || product.stock <= 0) return;

    try {

      const checkId = await getOrCreateOpenCheck(
        clientId,
        sessionId
      );

      setActiveCheckId(checkId);

      await addItemToCheck(checkId, product);

    } catch (err) {

      console.error("POS add error:", err);

    }

  };

  /* ================= POS TOTAL ================= */

  const checkTotal = checkItems.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );

  /* ================= POS PAYMENT ================= */

  const savePosCheck = async (
    clientId,
    sessionId,
    paymentMethods
  ) => {

    if (!activeCheckId) return;

    try {

      await payCheck(
        activeCheckId,
        checkTotal,
        paymentMethods,
        clientId,
        sessionId
      );

      setActiveCheckId(null);
      setCheckItems([]);

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

    } catch (err) {

      console.error("Payment error:", err);

    }

  };

  /* ================= INCOMING ADD ================= */

  const addToIncomingInvoice = (product) => {

    if (!product) return;

    invoice.addToInvoice(product);

  };

  /* ================= SAVE INCOMING ================= */

  const saveIncomingInvoice = async () => {

    if (!invoice.invoiceItems.length) return;

    try {

      const items = invoice.invoiceItems.map(item => ({
        productId: item.id,
        quantity: Number(item.quantity),
        purchasePrice: Number(item.purchasePrice)
      }));

      await createBarIncomingFn({
        gymId,
        items
      });

      invoice.clearInvoice();

      console.log("Incoming saved");

    } catch (err) {

      console.error("Incoming error:", err);

    }

  };

  return (
    <BarContext.Provider
      value={{
        categories,
        products,

        selectedCategory,
        setSelectedCategory,
        filteredProducts,

        /* POS */
        checkItems,
        checkTotal,
        addToPosInvoice,
        savePosCheck,

        /* INCOMING */
        invoiceItems: invoice.invoiceItems,
        invoiceTotal: invoice.invoiceTotal,
        addToIncomingInvoice,
        updateQuantity: invoice.updateQuantity,
        updatePurchasePrice: invoice.updatePurchasePrice,
        removeItem: invoice.removeItem,
        saveIncomingInvoice
      }}
    >
      {children}
    </BarContext.Provider>
  );

}