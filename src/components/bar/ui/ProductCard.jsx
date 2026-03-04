export default function ProductCard({
  product,
  image,
  overlay,
  footer,
  onClick,
  disabled,
}) {

  const imgSrc =
    image && image.startsWith("http")
      ? image
      : image && image.startsWith("/")
      ? image
      : "/images/default.png";

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`group relative rounded-2xl border border-white/10 overflow-hidden transition
      ${
        disabled
          ? "bg-white/5 opacity-40"
          : "bg-white/5 hover:bg-white/10 cursor-pointer"
      }`}
    >
      {overlay}

      <div className="aspect-square w-full overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          onError={(e) => {
            e.target.src = "/images/default.png";
          }}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="text-sm font-medium">
          {product.name}
        </div>

        <div className="text-xs text-gray-400 mt-1">
          {(product.price || 0).toLocaleString()} so'm
        </div>

        {footer}
      </div>
    </div>
  );
}