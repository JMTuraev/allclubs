import { useState } from "react"

export default function SessionDetails({ session }) {
  const [tab, setTab] = useState("bar")

  const tabs = ["bar", "package", "trainer"]

  const filtered = session.transactions.filter(
    (tx) => tx.type === tab
  )

  return (
    <div>
      <div className="flex gap-6 border-b border-white/10 pb-3 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`capitalize text-sm ${
              tab === t
                ? "text-indigo-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {!filtered.length && (
        <div className="text-sm text-gray-500">
          No transactions
        </div>
      )}

      {filtered.map((tx) => (
        <div
          key={tx.id}
          className="flex justify-between py-2 border-b border-white/10 text-sm text-gray-300"
        >
          <span>{tx.title}</span>
          <span>
            {tx.amount.toLocaleString()} so'm
          </span>
        </div>
      ))}
    </div>
  )
}