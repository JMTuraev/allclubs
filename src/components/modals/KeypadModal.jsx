import { useState } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

export default function KeypadModal({
  mode = "checkin", // checkin | checkout
  onClose,
  onConfirm,
}) {
  const [keyType, setKeyType] = useState("manual")
  const [code, setCode] = useState("")

  const handleNumber = (num) => {
    if (code.length >= 6) return
    setCode((prev) => prev + num)
  }

  const handleClear = () => setCode("")
  const handleBack = () =>
    setCode((prev) => prev.slice(0, -1))

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl border border-white/10 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {mode === "checkin"
              ? "Give Key"
              : "Enter Key to Close"}
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white transition" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Toggle */}
          <div className="flex gap-4 text-sm">
            <button
              onClick={() => setKeyType("manual")}
              className={`px-3 py-2 rounded-lg ${
                keyType === "manual"
                  ? "bg-indigo-600/30 border border-indigo-500"
                  : "bg-gray-800"
              }`}
            >
              Manual
            </button>

            <button
              onClick={() => setKeyType("magnetic")}
              className={`px-3 py-2 rounded-lg ${
                keyType === "magnetic"
                  ? "bg-indigo-600/30 border border-indigo-500"
                  : "bg-gray-800"
              }`}
            >
              Magnetic
            </button>
          </div>

          {keyType === "manual" ? (
            <>
              <div className="text-center text-2xl tracking-widest font-mono text-white">
                {code || "— — — —"}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6,7,8,9].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleNumber(String(n))}
                    className="py-4 bg-gray-800 rounded-lg text-lg hover:bg-gray-700"
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={handleClear}
                  className="py-4 bg-gray-800 rounded-lg text-sm"
                >
                  Clear
                </button>

                <button
                  onClick={() => handleNumber("0")}
                  className="py-4 bg-gray-800 rounded-lg text-lg"
                >
                  0
                </button>

                <button
                  onClick={handleBack}
                  className="py-4 bg-gray-800 rounded-lg text-sm"
                >
                  ⌫
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-10">
              Waiting for magnetic scan...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(code, keyType)}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg font-semibold"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  )
}