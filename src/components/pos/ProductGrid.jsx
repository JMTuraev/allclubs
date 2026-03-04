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

      {/* HEADER */}

      <div className="p-4 border-b border-white/10 text-sm font-semibold">
        {mode === "pos"
          ? selectedClient
            ? `Serving: ${selectedClient.name}`
            : "Select Client First"
          : "Manage Products"}
      </div>

      {/* GRID */}

      <div className="flex-1 overflow-y-auto p-6">

        <div className="grid grid-cols-5 gap-5">

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
                className={`group relative rounded-xl border border-white/10 overflow-hidden transition ${
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

                {/* QTY BADGE */}

                {mode === "pos" && cartItem && (
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[11px] px-2 py-[2px] rounded">
                    {cartItem.qty}
                  </div>
                )}

                {/* STOCK BADGE */}

                {mode === "pos" && (
                  <div className={`absolute top-2 right-2 text-[11px] px-2 py-[2px] rounded ${
                    isOutOfStock
                      ? "bg-red-500/20 text-red-400"
                      : "bg-white/20 text-white"
                  }`}>
                    {isOutOfStock ? "0" : product.stock}
                  </div>
                )}

                {/* ADMIN MENU */}

                {mode === "admin" && (
                  <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(
                          menuOpenId === product.id
                            ? null
                            : product.id
                        );
                      }}
                      className="p-1.5 rounded-full bg-white/90 border border-black/10 shadow"
                    >
                      <EllipsisVerticalIcon className="h-3 w-3 text-gray-800"/>
                    </button>

                    {menuOpenId === product.id && (

                      <div className="absolute right-0 mt-2 w-28 bg-[#111827] border border-white/10 rounded-lg shadow-xl">

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(null);
                            onEdit?.(product);
                          }}
                          className="block w-full text-left px-3 py-2 text-xs hover:bg-white/5"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(null);
                            onDelete?.(product.id);
                          }}
                          className="block w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/5"
                        >
                          Delete
                        </button>

                      </div>
                    )}

                  </div>
                )}

                {/* IMAGE */}

                <div className="aspect-square w-full overflow-hidden bg-[#0f172a]">

                  <img
                    src={product.image || "/images/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e)=>{
                      e.target.src="/images/placeholder.png"
                    }}
                  />

                </div>

                {/* INFO */}

                <div className="p-3">

                  <div className="text-sm font-medium truncate">
                    {product.name}
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {product.price.toLocaleString()} so'm
                  </div>

                </div>

              </div>
            );
          })}

          {/* ADD PRODUCT CARD */}

          {mode === "admin" && (

            <div
              onClick={onAddClick}
              className="aspect-square flex flex-col items-center justify-center rounded-xl border border-dashed border-indigo-500 bg-white/[0.02] hover:bg-indigo-500/10 transition cursor-pointer"
            >

              <div className="text-indigo-400 text-2xl mb-1">
                +
              </div>

              <span className="text-indigo-400 text-xs font-semibold">
                Add Product
              </span>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}