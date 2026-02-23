export default function ProductListLayout({ children }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {children}
    </div>
  );
}