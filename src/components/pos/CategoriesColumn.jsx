import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export default function CategoriesColumn({
  categories,
  selectedCategory,
  onSelectCategory,
  cartCount = 0,
}) {
  return (
    <div className="w-48 border-r border-white/10 flex flex-col bg-[#0e1628]">

      {/* SEARCH */}
      <div className="p-4 border-b border-white/10">
        <input
          placeholder="Search..."
          className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs outline-none"
        />
      </div>

      {/* CATEGORY LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {categories.map((cat) => {
          const isActive = selectedCategory?.id === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory?.(cat)}  // 🔥 MUHIM
              className={`p-3 rounded-xl cursor-pointer transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-medium">
                {cat.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* CART FOOTER (POS page uchun) */}
      {cartCount !== undefined && (
        <div className="p-4 border-t border-white/10 flex justify-between">
          <ShoppingCartIcon className="w-4 h-4" />
          <span>{cartCount}</span>
        </div>
      )}
    </div>
  );
}