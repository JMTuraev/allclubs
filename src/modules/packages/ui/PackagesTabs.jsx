export default function PackagesTabs({ activeTab, onChange }) {
  return (
    <div className="px-6 pt-6">
      <div className="flex gap-3">

        <button
          onClick={() => onChange("templates")}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
            ${
              activeTab === "templates"
                ? "bg-indigo-600/20 text-indigo-400"
                : "text-gray-400 hover:text-white"
            }
          `}
        >
          Package Templates
        </button>

        <button
          onClick={() => onChange("sold")}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
            ${
              activeTab === "sold"
                ? "bg-indigo-600/20 text-indigo-400"
                : "text-gray-400 hover:text-white"
            }
          `}
        >
          Sold Packages
        </button>

      </div>
    </div>
  )
}