import { useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export default function ProductGrid({
  products,
  mode = "admin",
  selectedClient,
  cart = [],
  onAdd,
  onAddClick,
  onEdit,
  onDelete,
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);

  return (
    <div className="flex-1 flex flex-col bg-[#0b1220]">

      <div className="p-4 border-b border-white/10 text-sm font-semibold">
        {mode === "pos"
          ? selectedClient
            ? `Serving: ${selectedClient.name}`
            : "Select Client First"
          : "Manage Products"}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-6">

          {products.map((product) => {

            const isOutOfStock = product.stock <= 0;

            const disabled =
              mode === "pos" &&
              (!selectedClient || isOutOfStock);

            const cartItem =
              mode === "pos"
                ? cart.find((i) => i.id === product.id)
                : null;

            return (
              <div
                key={product.id}
                className={`group relative rounded-2xl border border-white/10 overflow-hidden transition ${
                  disabled
                    ? "bg-white/5 opacity-40"
                    : "bg-white/5 hover:bg-white/10 cursor-pointer"
                }`}
                onClick={() =>
                  mode === "pos" &&
                  !disabled &&
                  onAdd(product)
                }
              >

                {/* 🔵 QTY BADGE (TOP LEFT) */}
                {mode === "pos" && cartItem && (
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                    {cartItem.qty}
                  </div>
                )}

                {/* 📦 STOCK SHORT (TOP RIGHT) */}
                {mode === "pos" && (
                  <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-md font-medium ${
                    isOutOfStock
                      ? "bg-red-500/20 text-red-400"
                      : "bg-white/20 text-white"
                  }`}>
                    {isOutOfStock ? "0" : product.stock}
                  </div>
                )}

                {/* ===== ADMIN MENU ===== */}
                {mode === "admin" && (
                  <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(
                          menuOpenId === product.id
                            ? null
                            : product.id
                        );
                      }}
                      className="p-2 rounded-full bg-white/90 backdrop-blur border border-black/10 shadow-md hover:shadow-lg transition"
                    >
                      <EllipsisVerticalIcon className="h-4 w-4 text-gray-800" />
                    </button>

                    {menuOpenId === product.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-[#111827] border border-white/10 rounded-lg shadow-xl">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(null);
                            onEdit?.(product);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-white/5"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(null);
                            onDelete?.(product.id);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* IMAGE */}
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* INFO */}
                <div className="p-4">
                  <div className="text-sm font-medium">
                    {product.name}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {product.price.toLocaleString()} so'm
                  </div>
                </div>

              </div>
            );
          })}

          {mode === "admin" && (
            <div
              onClick={onAddClick}
              className="aspect-square flex items-center justify-center border-2 border-dashed border-indigo-500 rounded-2xl cursor-pointer hover:bg-indigo-500/10 transition"
            >
              <span className="text-indigo-400 text-sm font-semibold">
                + Add Product
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}