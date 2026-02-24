import { createContext, useContext, useState } from "react";
import { useProducts } from "../ProductContext";
import { useBarInvoice } from "../../modules/bar/domain/useBarInvoice";
import { v4 as uuid } from "uuid";

const BarContext = createContext();
export const useBar = () => useContext(BarContext);

export function BarProvider({ children }) {
  const {
    categories,
    products,
    updateProduct
  } = useProducts();

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

  /* ================= HISTORY STATE ================= */

  const [incomingInvoices, setIncomingInvoices] = useState([]);

  const saveIncomingInvoice = () => {
    if (!invoice.invoiceItems.length) return;

    invoice.invoiceItems.forEach(item => {
      const currentProduct = products.find(
        p => p.id === item.id
      );

      if (!currentProduct) return;

      updateProduct(item.id, {
        stock: (currentProduct.stock || 0) + item.quantity,
        purchasePrice: Number(item.purchasePrice) || 0
      });
    });

    const newInvoice = {
      id: uuid(),
      invoiceNumber: "INC-" + Date.now().toString().slice(-6),
      date: new Date().toISOString().split("T")[0],
      items: invoice.invoiceItems,
      total: invoice.invoiceTotal,
    };

    setIncomingInvoices(prev => [
      newInvoice,
      ...prev,
    ]);

    invoice.clearInvoice();
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

        /* history */
        incomingInvoices,
        saveIncomingInvoice,
      }}
    >
      {children}
    </BarContext.Provider>
  );
}