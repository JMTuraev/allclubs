export default function ProductCard({
  product,
  image,
  overlay,
  footer,
  onClick,
  disabled,
}) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`group relative rounded-2xl border border-white/10 overflow-hidden transition
        ${disabled
          ? "bg-white/5 opacity-40"
          : "bg-white/5 hover:bg-white/10 cursor-pointer"
        }`}
    >
      {overlay}

      {image && (
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="text-sm font-medium">
          {product.name}
        </div>

        <div className="text-xs text-gray-400 mt-1">
          {product.price.toLocaleString()} so'm
        </div>

        {footer}
      </div>
    </div>
  );
}