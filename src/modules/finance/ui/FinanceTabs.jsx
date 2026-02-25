export default function FinanceTabs({ activeTab, onChange }) {
  return (
    <div className="flex gap-8 border-b border-white/10">
      <TabButton
        active={activeTab === "overview"}
        onClick={() => onChange("overview")}
      >
        Overview
      </TabButton>

      <TabButton
        active={activeTab === "transactions"}
        onClick={() => onChange("transactions")}
      >
        Transactions
      </TabButton>
    </div>
  )
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-semibold transition ${
        active
          ? "text-indigo-400 border-b-2 border-indigo-500"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  )
}