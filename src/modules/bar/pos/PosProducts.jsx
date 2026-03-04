import BarPanel from "../../../components/bar/ui/BarPanel";
import ProductGridLayout from "../../../components/bar/ui/ProductGridLayout";
import ProductCard from "../../../components/bar/ui/ProductCard";

export default function PosProducts({
  products,
  selectedClient,
  cart,
  onAdd
}) {
  return (
    <BarPanel
      title={
        selectedClient
          ? `Serving: ${selectedClient.name}`
          : "Select Client First"
      }
    >
      <ProductGridLayout>
        {products.map(product => {
          const cartItem = cart.find(i => i.productId === product.id);

          const isOutOfStock = product.stock <= 0;
          const isDisabled = !selectedClient || isOutOfStock;

          return (
            <ProductCard
              key={product.id}
              product={product}
              image={product.image}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  onAdd(product);
                }
              }}
              overlay={
                <>
                  {/* 🔢 QTY BADGE - TOP LEFT */}
                  {cartItem && (
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md font-semibold">
                      {cartItem.qty}
                    </div>
                  )}

                  {/* 📦 STOCK SHORT - TOP RIGHT */}
                  <div
                    className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-md font-medium ${
                      isOutOfStock
                        ? "bg-red-500/20 text-red-400"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {isOutOfStock ? "0" : product.stock}
                  </div>
                </>
              }
            />
          );
        })}
      </ProductGridLayout>
    </BarPanel>
  );
}