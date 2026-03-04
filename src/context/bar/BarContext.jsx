import { createContext, useContext, useState } from "react";
import { useProducts } from "../ProductContext";
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

  const invoice = useBarInvoice();

  /* ================= ADD METHODS ================= */

  const addToPosInvoice = (product) => {
    if (!product || product.stock <= 0) return;
    invoice.addToInvoice(product);
  };

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

      console.log("Incoming invoice saved");

    } catch (err) {

      console.error("Incoming save error:", err);

      alert(err.message);
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

        /* invoice state */
        invoiceItems: invoice.invoiceItems,
        invoiceTotal: invoice.invoiceTotal,

        /* invoice actions */
        addToPosInvoice,
        addToIncomingInvoice,
        updateQuantity: invoice.updateQuantity,
        updatePurchasePrice: invoice.updatePurchasePrice,
        removeItem: invoice.removeItem,

        /* save */
        saveIncomingInvoice,
      }}
    >
      {children}
    </BarContext.Provider>
  );
} 