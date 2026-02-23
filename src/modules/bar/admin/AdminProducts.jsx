import BarPanel from "../../../components/bar/ui/BarPanel";
import ProductGridLayout from "../../../components/bar/ui/ProductGridLayout";
import ProductCard from "../../../components/bar/ui/ProductCard";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function AdminProducts({
  products,
  onEdit,
  onDelete,
  onAddClick
}) {
  const [openId, setOpenId] = useState(null);

  return (
    <BarPanel title="Manage Products">
      <ProductGridLayout>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            image={product.image}
            overlay={
              <div className="absolute top-3 right-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenId(openId === product.id ? null : product.id);
                  }}
                  className="p-2 rounded-full bg-white/90 shadow"
                >
                  <EllipsisVerticalIcon className="h-4 w-4 text-gray-800" />
                </button>

                {openId === product.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#111827] border border-white/10 rounded-lg shadow-xl">
                    <button
                      onClick={() => onEdit(product)}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-white/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            }
          />
        ))}

        <div
          onClick={onAddClick}
          className="aspect-square flex items-center justify-center border-2 border-dashed border-indigo-500 rounded-2xl cursor-pointer hover:bg-indigo-500/10 transition"
        >
          <span className="text-indigo-400 text-sm font-semibold">
            + Add Product
          </span>
        </div>
      </ProductGridLayout>
    </BarPanel>
  );
}