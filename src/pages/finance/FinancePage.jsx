import { useState, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import AddTransactionModal from "../../components/finance/AddTransactionModal"

export default function FinancePage() {
  const { dateFilter } = useOutletContext()
  const [transactions, setTransactions] = useState([])

  const handleAdd = (transaction) => {
    setTransactions((prev) => [transaction, ...prev])
  }

  // ===== FILTER LOGIC =====
  const filteredTransactions = useMemo(() => {
    if (!dateFilter) return transactions

    const { activeFilter, range } = dateFilter
    const now = new Date()

    if (activeFilter === "all") return transactions

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )

    if (activeFilter === "today") {
      return transactions.filter(
        (t) => t.createdAt >= startOfToday
      )
    }

    if (activeFilter === "7") {
      const past = new Date()
      past.setDate(now.getDate() - 7)
      return transactions.filter(
        (t) => t.createdAt >= past
      )
    }

    if (activeFilter === "30") {
      const past = new Date()
      past.setDate(now.getDate() - 30)
      return transactions.filter(
        (t) => t.createdAt >= past
      )
    }

    if (activeFilter === "month") {
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
      return transactions.filter(
        (t) => t.createdAt >= startOfMonth
      )
    }

    if (activeFilter === "custom" && range?.from && range?.to) {
      return transactions.filter(
        (t) =>
          t.createdAt >= range.from &&
          t.createdAt <= range.to
      )
    }

    return transactions
  }, [transactions, dateFilter])

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const net = totalIncome - totalExpense

  return (
    <div className="space-y-8">

      <AddTransactionModal onAdd={handleAdd} />

      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-3 gap-6">

        <GlassCard>
          <p className="text-sm text-gray-400 mb-1">
            Income
          </p>
          <p className="text-2xl font-semibold text-emerald-400">
            {totalIncome}
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-gray-400 mb-1">
            Expense
          </p>
          <p className="text-2xl font-semibold text-rose-400">
            {totalExpense}
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-gray-400 mb-1">
            Net
          </p>
          <p
            className={`text-2xl font-semibold ${
              net >= 0
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {net}
          </p>
        </GlassCard>

      </div>

      {/* ===== TABLE ===== */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center text-gray-500"
                >
                  No transactions yet
                </td>
              </tr>
            )}

            {filteredTransactions.map((t) => (
              <tr
                key={t.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-4">
                  {t.createdAt?.toLocaleDateString()}
                </td>

                <td
                  className={`p-4 capitalize ${
                    t.type === "income"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {t.type}
                </td>

                <td className="p-4 capitalize text-gray-300">
                  {t.category}
                </td>

                <td className="p-4 text-right font-semibold">
                  {t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  )
}

/* ===== GLASS CARD ===== */

function GlassCard({ children }) {
  return (
    <div className="
      rounded-2xl
      border border-white/10
      bg-white/5
      backdrop-blur-xl
      p-6
      shadow-xl
    ">
      {children}
    </div>
  )
}