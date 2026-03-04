import BarPanel from "../../../components/bar/ui/BarPanel";
import ProductListLayout from "../../../components/bar/ui/ProductListLayout";

export default function IncomingProducts({ products = [], onAdd }) {
  const handleAdd = (product) => {
    if (!product) return;
    onAdd?.(product);
  };

  return (
    <BarPanel title="Select Product">
      <ProductListLayout>

        {products.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-10">
            No products in this category
          </div>
        )}

        {products.map((product) => {
          const price = Number(product.price) || 0;

          return (
            <div
              key={product.id}
              onClick={() => handleAdd(product)}
              className="
                group
                p-3
                bg-white/5
                rounded-xl
                border border-white/5
                hover:bg-white/10
                hover:border-indigo-500/30
                cursor-pointer
                transition
                active:scale-[0.98]
              "
            >
              <div className="text-sm font-medium text-white">
                {product.name}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                {price.toLocaleString()} so'm
              </div>
            </div>
          );
        })}

      </ProductListLayout>
    </BarPanel>
  );
}