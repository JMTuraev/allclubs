import BarPanel from "../../../components/bar/ui/BarPanel";
import ProductListLayout from "../../../components/bar/ui/ProductListLayout";

export default function IncomingProducts({
  products,
  onAdd
}) {
  return (
    <BarPanel title="Select Product">
      <ProductListLayout>
        {products.map(product => (
          <div
            key={product.id}
            onClick={() => onAdd(product)}
            className="p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer"
          >
            <div className="text-sm">{product.name}</div>
            <div className="text-xs text-gray-400">
              {product.price.toLocaleString()} so'm
            </div>
          </div>
        ))}
      </ProductListLayout>
    </BarPanel>
  );
}