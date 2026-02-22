import { PlusIcon } from "@heroicons/react/24/outline";

export default function ProductGrid({
  products,
  selectedClient,
  cart,
  onAdd,
  showAddCard = false,
  onAddClick,
}) {
  return (
    <div className="flex-1 flex flex-col bg-[#0b1220]">

      <div className="p-4 border-b border-white/10 text-sm font-semibold">
        {selectedClient
          ? `Serving: ${selectedClient.name}`
          : "Select Client First"}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-6">

          {/* 🟣 ADD PRODUCT CARD */}
       {showAddCard && (
  <div
    onClick={onAddClick}
    className="relative rounded-2xl border border-dashed border-indigo-500 bg-white/5 hover:bg-white/10 transition cursor-pointer overflow-hidden"
  >
    <div className="aspect-square w-full flex items-center justify-center">
      <PlusIcon className="h-10 w-10 text-indigo-400" />
    </div>

    <div className="p-4">
      <div className="text-sm font-medium text-indigo-400">
        Add Product
      </div>
    </div>
  </div>
)}

          {products.map((product) => {
            const disabled = !selectedClient;
            const cartItem = cart.find(i => i.id === product.id);

            return (
              <div
                key={product.id}
                onClick={() => !disabled && onAdd?.(product)}
                className={`relative rounded-2xl border border-white/10 transition overflow-hidden ${
                  disabled
                    ? "bg-white/5 opacity-40 cursor-not-allowed"
                    : "bg-white/5 hover:bg-white/10 cursor-pointer"
                }`}
              >
                {/* BADGE */}
                {cartItem && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-indigo-600 text-white text-xs flex items-center justify-center rounded-full">
                    {cartItem.qty}
                  </div>
                )}

                {/* IMAGE */}
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
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

        </div>
      </div>

    </div>
  );
}