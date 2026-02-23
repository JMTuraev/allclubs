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
          const cartItem = cart.find(i => i.id === product.id);

          return (
            <ProductCard
              key={product.id}
              product={product}
              image={product.image}
              disabled={!selectedClient}
              onClick={() => onAdd(product)}
              overlay={
                cartItem && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-indigo-600 text-white text-xs flex items-center justify-center rounded-full">
                    {cartItem.qty}
                  </div>
                )
              }
            />
          );
        })}
      </ProductGridLayout>
    </BarPanel>
  );
}