import { useMemo, useState } from "react";

export function useBarInvoice() {
  const [invoiceItems, setInvoiceItems] = useState([]);

  const addToInvoice = (product) => {
    if (!product) return;

    setInvoiceItems(prev => {
      const exists = prev.find(i => i.id === product.id);

      if (exists) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          purchasePrice: ""
        }
      ];
    });
  };

  const updateQuantity = (id, qty) => {
    setInvoiceItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Number(qty) || 1 }
          : item
      )
    );
  };

  const updatePurchasePrice = (id, value) => {
    setInvoiceItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, purchasePrice: value }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setInvoiceItems(prev =>
      prev.filter(item => item.id !== id)
    );
  };

  const clearInvoice = () => {
    setInvoiceItems([]);
  };

  const invoiceTotal = useMemo(() => {
    return invoiceItems.reduce((sum, item) => {
      const priceNumber = Number(item.purchasePrice) || 0;
      return sum + item.quantity * priceNumber;
    }, 0);
  }, [invoiceItems]);

  return {
    invoiceItems,
    addToInvoice,
    updateQuantity,
    updatePurchasePrice,
    removeItem,
    clearInvoice,
    invoiceTotal
  };
}