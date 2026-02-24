import { useState, useMemo } from "react";
import {
  BanknotesIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/solid";

export default function PaymentModal({
  total,
  client,
  checkNumber,
  onClose,
  onConfirm
}) {
  const [activeMethod, setActiveMethod] = useState(null);
  const [amounts, setAmounts] = useState({
    cash: 0,
    terminal: 0,
    click: 0,
    debt: 0,
  });
  const [comment, setComment] = useState("");

  /* ================= CALCULATIONS ================= */

  const paid = useMemo(() => {
    return Object.values(amounts).reduce(
      (sum, v) => sum + Number(v || 0),
      0
    );
  }, [amounts]);

  const remaining = total - paid;
  const isDebtUsed = amounts.debt > 0;

  const isValid =
    remaining === 0 &&
    total > 0 &&
    (!isDebtUsed || comment.trim().length > 0);

  /* ================= ACTIVATE METHOD ================= */

  const activate = (method) => {
    setActiveMethod(method);

    setAmounts(prev => {
      // agar hali qiymat kiritilmagan bo‘lsa auto-fill qilamiz
      if (!prev[method]) {
        const otherSum =
          Object.entries(prev)
            .filter(([k]) => k !== method)
            .reduce((sum, [, v]) => sum + v, 0);

        const allowed = total - otherSum;

        return {
          ...prev,
          [method]: allowed > 0 ? allowed : 0
        };
      }

      return prev;
    });
  };

  /* ================= UPDATE AMOUNT ================= */

  const updateAmount = (method, value) => {
    const numeric = Number(value) || 0;

    setAmounts(prev => {
      const otherSum =
        Object.entries(prev)
          .filter(([k]) => k !== method)
          .reduce((sum, [, v]) => sum + v, 0);

      const allowed = total - otherSum;

      return {
        ...prev,
        [method]: numeric > allowed ? allowed : numeric
      };
    });
  };

  /* ================= UI CONFIG ================= */

  const methods = [
    {
      key: "cash",
      label: "Cash",
      icon: <BanknotesIcon className="w-5 h-5" />,
      gradient: "from-emerald-500 to-emerald-700"
    },
    {
      key: "terminal",
      label: "Terminal",
      icon: <CreditCardIcon className="w-5 h-5" />,
      gradient: "from-indigo-500 to-indigo-700"
    },
    {
      key: "click",
      label: "Click",
      icon: <DevicePhoneMobileIcon className="w-5 h-5" />,
      gradient: "from-cyan-500 to-cyan-700"
    },
    {
      key: "debt",
      label: "Debt",
      icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      gradient: "from-red-500 to-red-700"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111827] w-[460px] rounded-2xl p-6 space-y-5 shadow-2xl">

        {/* HEADER */}
        <div>
          <div className="text-lg font-semibold">
            Payment
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Check: {checkNumber || "-"}
          </div>
          <div className="text-xs text-gray-400">
            Client: {client?.name || "-"}
          </div>
        </div>

        <div className="text-sm">
          Total:{" "}
          <span className="font-semibold">
            {total.toLocaleString()} so'm
          </span>
        </div>

        {/* METHODS */}
        <div className="space-y-3">
          {methods.map((m) => (
            <div
              key={m.key}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => activate(m.key)}
                className={`flex items-center justify-center gap-2 w-32 py-2 rounded-lg text-sm font-medium transition 
                ${
                  activeMethod === m.key
                    ? `bg-gradient-to-r ${m.gradient}`
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {m.icon}
                {m.label}
              </button>

              <input
                type="number"
                disabled={activeMethod !== m.key}
                value={amounts[m.key]}
                onChange={(e) =>
                  updateAmount(m.key, e.target.value)
                }
                className="flex-1 bg-[#0B1120] rounded px-3 py-2 text-sm disabled:opacity-40"
              />
            </div>
          ))}
        </div>

        {/* COMMENT */}
        <div>
          <textarea
            placeholder={
              isDebtUsed
                ? "Comment required (Debt)"
                : "Comment (optional)"
            }
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            className={`w-full bg-[#0B1120] rounded px-3 py-2 text-sm ${
              isDebtUsed && !comment
                ? "border border-red-500"
                : ""
            }`}
          />
        </div>

        {/* REMAINING */}
        <div className="text-sm">
          Remaining:{" "}
          <span
            className={
              remaining === 0
                ? "text-emerald-400"
                : "text-red-400"
            }
          >
            {remaining.toLocaleString()} so'm
          </span>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 rounded-lg"
          >
            Cancel
          </button>

          <button
            disabled={!isValid}
            onClick={() =>
              onConfirm({
                methods: amounts,
                comment
              })
            }
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isValid
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}