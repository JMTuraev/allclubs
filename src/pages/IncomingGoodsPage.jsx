import { createContext, useContext, useMemo, useState } from "react";

/* =========================== */

const IncomingContext = createContext();
const useIncoming = () => useContext(IncomingContext);

export default function IncomingGoodsPage() {
  const [categories] = useState([
    { id: 1, name: "Drinks" },
    { id: 2, name: "Snacks" },
  ]);

  const [products] = useState([
    { id: 1, categoryId: 1, name: "Cola", price: 7000 },
    { id: 2, categoryId: 1, name: "Fanta", price: 8000 },
    { id: 3, categoryId: 2, name: "Chips", price: 5000 },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const invoiceNumber = "INC-" + Date.now().toString().slice(-6);
  const today = new Date().toISOString().split("T")[0];

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter(p => p.categoryId === selectedCategory);
  }, [selectedCategory, products]);

  const addToInvoice = (product) => {
    setInvoiceItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: String(Number(i.quantity) + 1) }
            : i
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          sellingPrice: product.price,
          quantity: "1",
          purchasePrice: ""
        }
      ];
    });
  };

  const updateQuantity = (id, value) => {
    setInvoiceItems(items =>
      items.map(i =>
        i.id === id ? { ...i, quantity: value } : i
      )
    );
  };

  const updatePurchasePrice = (id, value) => {
    setInvoiceItems(items =>
      items.map(i =>
        i.id === id ? { ...i, purchasePrice: value } : i
      )
    );
  };

  const removeItem = (id) => {
    setInvoiceItems(items => items.filter(i => i.id !== id));
  };

  const invoiceTotal = useMemo(() => {
    return invoiceItems.reduce((sum, item) => {
      const qty = Number(item.quantity);
      const price = Number(item.purchasePrice);
      if (qty > 0 && price > 0) return sum + qty * price;
      return sum;
    }, 0);
  }, [invoiceItems]);

  const handleSave = () => {
    alert("Saved!");
  };

  return (
    <IncomingContext.Provider
      value={{
        categories,
        filteredProducts,
        selectedCategory,
        setSelectedCategory,
        addToInvoice,
        invoiceItems,
        updateQuantity,
        updatePurchasePrice,
        removeItem,
        invoiceTotal,
        invoiceNumber,
        today,
        handleSave
      }}
    >
      <div className="h-full overflow-hidden bg-[#0B1120] text-white">
        <div className="flex gap-3 h-full p-3">

          <CategoriesColumn />
          <ProductsColumn />
          <InvoiceColumn />

        </div>
      </div>
    </IncomingContext.Provider>
  );
}

/* =========================== */

function CategoriesColumn() {
  const { categories, selectedCategory, setSelectedCategory } = useIncoming();

  return (
    <div className="w-1/5 bg-[#111827] rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-800 text-xs uppercase text-gray-400">
        Categories
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition
              ${selectedCategory === cat.id
                ? "bg-indigo-600"
                : "bg-[#1F2937] hover:bg-[#374151]"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================== */

function ProductsColumn() {
  const { filteredProducts, addToInvoice } = useIncoming();

  return (
    <div className="w-1/4 bg-[#111827] rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-800 text-xs uppercase text-gray-400">
        Products
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredProducts.map(product => (
          <button
            key={product.id}
            onClick={() => addToInvoice(product)}
            className="w-full text-left px-3 py-2 bg-[#1F2937] hover:bg-indigo-600 rounded-md transition"
          >
            <div className="text-sm">{product.name}</div>
            <div className="text-[11px] text-gray-500">
              Sell: {product.price.toLocaleString()} so'm
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================== */

function InvoiceColumn() {
  const {
    invoiceItems,
    updateQuantity,
    updatePurchasePrice,
    removeItem,
    invoiceTotal,
    invoiceNumber,
    today,
    handleSave
  } = useIncoming();

  return (
    <div className="flex-1 bg-[#111827] rounded-xl flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="p-3 border-b border-gray-800 flex justify-between text-xs text-gray-400 shrink-0">
        <div>
          <div>Incoming Invoice</div>
          <div className="text-gray-500">{invoiceNumber}</div>
        </div>
        <div>{today}</div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {invoiceItems.map(item => {
          const qty = Number(item.quantity);
          const price = Number(item.purchasePrice);
          const lineTotal =
            qty > 0 && price > 0 ? qty * price : null;

          return (
            <div
              key={item.id}
              className="bg-[#1F2937] rounded-md p-2 flex items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {item.name}
                </div>
                <div className="text-[11px] text-gray-500">
                  Selling: {item.sellingPrice.toLocaleString()} so'm
                </div>
              </div>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, e.target.value)
                }
                className="w-14 bg-[#0B1120] rounded px-2 py-1 text-xs text-center"
              />

              <input
                type="number"
                min="0"
                placeholder="Price"
                value={item.purchasePrice}
                onChange={(e) =>
                  updatePurchasePrice(item.id, e.target.value)
                }
                className="w-24 bg-[#0B1120] rounded px-2 py-1 text-xs text-center"
              />

              <div className="w-24 text-right text-sm font-medium">
                {lineTotal !== null
                  ? lineTotal.toLocaleString() + " so'm"
                  : ""}
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 p-3 bg-[#111827] shrink-0">
        <div className="flex justify-between items-center">

          {/* LEFT */}
          <div>
            <div className="text-xs text-gray-400">Total</div>
            <div className="text-lg font-bold">
              {invoiceTotal.toLocaleString()} so'm
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md text-sm font-medium transition"
          >
            save
          </button>

        </div>
      </div>

    </div>
  );
}