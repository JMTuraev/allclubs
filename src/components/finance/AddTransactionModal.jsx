import { useState } from "react"

export default function AddTransactionModal({
  onAdd,
  transactions,
}) {
  const [type, setType] = useState("service")
  const [category, setCategory] = useState("membership")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amount, setAmount] = useState("")
  const [clientId, setClientId] = useState("client_1")

  const currentUser = {
    id: "staff_1",
    name: "Owner",
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount) return

    const numericAmount = Number(amount)

    // ================= PAYMENT BARRIER =================
    if (type === "payment") {
      const clientTransactions = transactions.filter(
        (t) => t.clientId === clientId
      )

      const serviceTotal = clientTransactions
        .filter((t) => t.type === "service")
        .reduce((sum, t) => sum + t.amount, 0)

      const paymentTotal = clientTransactions
        .filter((t) => t.type === "payment")
        .reduce((sum, t) => sum + t.amount, 0)

      const outstanding = serviceTotal - paymentTotal

      if (outstanding <= 0) {
        alert("Client has no outstanding balance.")
        return
      }

      if (numericAmount > outstanding) {
        alert(`Maximum allowed payment: ${outstanding}`)
        return
      }
    }

    onAdd({
      id: Date.now(),
      type,
      category,
      amount: numericAmount,
      paymentMethod: type === "payment" ? paymentMethod : null,
      clientId: type !== "expense" ? clientId : null,
      createdBy: currentUser,
      createdAt: new Date(),
    })

    setAmount("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-3 mb-6"
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
      >
        <option value="service">Service</option>
        <option value="payment">Payment</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
      >
        <option value="membership">Membership</option>
        <option value="bar">Bar</option>
        <option value="trainer">Trainer</option>
        <option value="salary">Salary</option>
        <option value="rent">Rent</option>
      </select>

      {type === "payment" && (
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          <option value="cash">Naqd</option>
          <option value="click">Click</option>
          <option value="terminal">Terminal</option>
        </select>
      )}

      {type !== "expense" && (
        <input
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
        />
      )}

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm w-40"
      />

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Add
      </button>
    </form>
  )
}