import { useMemo, useState } from "react";

export function useBarInvoice() {
  const [invoiceItems, setInvoiceItems] = useState([]);

  const addToInvoice = (product) => {
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
        { ...product, quantity: 1 }
      ];
    });
  };

  const invoiceTotal = useMemo(() => {
    return invoiceItems.reduce(
      (sum, item) =>
        sum + item.quantity * item.price,
      0
    );
  }, [invoiceItems]);

  return {
    invoiceItems,
    addToInvoice,
    invoiceTotal
  };
}