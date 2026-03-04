export default function ProductGridLayout({ children }) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-5 gap-6">
        {children}
      </div>
    </div>
  );
}