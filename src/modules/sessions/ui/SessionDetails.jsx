import { useState, useMemo } from "react"

export default function SessionDetails({ session }) {
  const [tab, setTab] = useState("bar")

  const tabs = ["bar", "package", "trainer"]

  /* 🔥 category bo‘yicha filter qilamiz */
  const filtered = useMemo(() => {
    return session.transactions.filter(
      (tx) => tx.category === tab
    )
  }, [session.transactions, tab])

  return (
    <div>
      {/* TABS */}
      <div className="flex gap-6 border-b border-white/10 pb-3 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`capitalize text-sm transition ${
              tab === t
                ? "text-indigo-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* EMPTY */}
      {!filtered.length && (
        <div className="text-sm text-gray-500">
          No transactions
        </div>
      )}

      {/* LIST */}
      {filtered.map((tx) => (
        <div
          key={tx.id}
          className="flex justify-between py-2 border-b border-white/10 text-sm text-gray-300"
        >
          <span>
            {tx.name || tx.title || "Service"}
          </span>

          <span>
            {Number(tx.amount).toLocaleString("ru-RU")} so'm
          </span>
        </div>
      ))}
    </div>
  )
}