import { useState } from "react";

export default function AddTransactionModal({ onAdd }) {
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("membership");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    onAdd({
      id: Date.now(),
      type,
      category,
      amount: Number(amount),
      createdAt: new Date(),
    });

    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <div className="flex gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="membership">Membership</option>
          <option value="bar">Bar</option>
          <option value="trainer">Trainer</option>
          <option value="expense">Other Expense</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded-lg w-40"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Add
        </button>
      </div>
    </form>
  );
}