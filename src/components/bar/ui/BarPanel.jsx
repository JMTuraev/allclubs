export default function BarPanel({ title, right, children }) {
  return (
    <div className="flex-1 flex flex-col bg-[#0b1220] rounded-xl overflow-hidden">
      {(title || right) && (
        <div className="p-4 border-b border-white/10 flex justify-between items-center text-sm font-semibold">
          <div>{title}</div>
          <div>{right}</div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}