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

  const stock = product?.stock ?? 0;

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
      {/* overlay (qty badge, menu etc) */}
      {overlay}

      {/* IMAGE */}
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

      {/* INFO */}
      <div className="p-4 relative">

        {/* NAME */}
        <div className="text-sm font-medium truncate">
          {product.name}
        </div>

        {/* PRICE */}
        <div className="text-xs text-gray-400 mt-1">
          {(product.price || 0).toLocaleString()} so'm
        </div>

        {/* STOCK BADGE */}
        <div
          className={`absolute bottom-3 right-3 text-[11px] px-2 py-[2px] rounded-md font-semibold
          ${
            stock > 0
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {stock}
        </div>

        {footer}
      </div>
    </div>
  );
}