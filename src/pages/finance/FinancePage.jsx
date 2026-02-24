import { useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { useTransactions } from "../../context/transaction/TransactionContext"

export default function FinancePage() {
  const { dateFilter } = useOutletContext()
  const { transactions } = useTransactions()

  const [dailyClosings, setDailyClosings] = useState([])
  const [lastClosedDate, setLastClosedDate] = useState(null)

  const todayString = new Date().toLocaleDateString()
  const isTodayClosed = lastClosedDate === todayString

  // ================= FILTER =================

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
      return transactions.filter((t) => t.createdAt >= startOfToday)
    }

    if (activeFilter === "7") {
      const past = new Date()
      past.setDate(now.getDate() - 7)
      return transactions.filter((t) => t.createdAt >= past)
    }

    if (activeFilter === "30") {
      const past = new Date()
      past.setDate(now.getDate() - 30)
      return transactions.filter((t) => t.createdAt >= past)
    }

    if (activeFilter === "month") {
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
      return transactions.filter((t) => t.createdAt >= startOfMonth)
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

  // ================= ACCOUNTING =================

  const totalServices = filteredTransactions
    .filter((t) => t.type === "service")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPayments = filteredTransactions
    .filter((t) => t.type === "payment")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const realProfit = totalPayments - totalExpenses

  // ================= CLIENT DEBT =================

  const clientBalances = useMemo(() => {
    const map = {}

    filteredTransactions.forEach((t) => {
      if (!t.clientId) return

      if (!map[t.clientId]) {
        map[t.clientId] = { services: 0, payments: 0 }
      }

      if (t.type === "service") {
        map[t.clientId].services += t.amount
      }

      if (t.type === "payment") {
        map[t.clientId].payments += t.amount
      }
    })

    return Object.entries(map).map(([clientId, data]) => ({
      clientId,
      services: data.services,
      payments: data.payments,
      balance: data.services - data.payments,
    }))
  }, [filteredTransactions])

  const totalDebt = clientBalances.reduce(
    (sum, c) => (c.balance > 0 ? sum + c.balance : sum),
    0
  )

  // ================= DAILY CLOSING =================

  const handleCloseDay = () => {
    if (isTodayClosed) return

    const closingData = {
      id: Date.now(),
      date: todayString,
      services: totalServices,
      payments: totalPayments,
      expenses: totalExpenses,
      debt: totalDebt,
      profit: realProfit,
      closedAt: new Date(),
    }

    setDailyClosings((prev) => [closingData, ...prev])
    setLastClosedDate(todayString)
  }

  return (
    <div className="space-y-10">

      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-4 gap-6">
        <GlassCard title="Services Sold" value={totalServices} color="indigo" />
        <GlassCard title="Payments Received" value={totalPayments} color="emerald" />
        <GlassCard title="Outstanding Debt" value={totalDebt} color="amber" />
        <GlassCard title="Real Profit" value={realProfit} color="cyan" />
      </div>

      {/* Close Day Button */}

      <div className="flex justify-end">
        <button
          onClick={handleCloseDay}
          disabled={isTodayClosed}
          className={`px-6 py-3 rounded-xl font-semibold ${
            isTodayClosed
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500"
          }`}
        >
          {isTodayClosed ? "Day Closed" : "Close Day"}
        </button>
      </div>

      {/* ================= CLIENT BALANCE TABLE ================= */}

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            Client Balances
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-right">Services</th>
              <th className="p-4 text-right">Payments</th>
              <th className="p-4 text-right">Balance</th>
            </tr>
          </thead>

          <tbody>
            {clientBalances.length === 0 && (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-500">
                  No client transactions
                </td>
              </tr>
            )}

            {clientBalances.map((c) => (
              <tr
                key={c.clientId}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-4 text-gray-300">{c.clientId}</td>
                <td className="p-4 text-right text-indigo-400">{c.services}</td>
                <td className="p-4 text-right text-emerald-400">{c.payments}</td>
                <td
                  className={`p-4 text-right font-semibold ${
                    c.balance > 0
                      ? "text-amber-400"
                      : c.balance < 0
                      ? "text-cyan-400"
                      : "text-emerald-400"
                  }`}
                >
                  {c.balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

function GlassCard({ title, value, color }) {
  const colors = {
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    cyan: "text-cyan-400",
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className={`text-2xl font-semibold ${colors[color]}`}>
        {value}
      </p>
    </div>
  )
}