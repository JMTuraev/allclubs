import { useState, useEffect, useMemo } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { usePackages } from "../domain/PackagesContext"

export default function EditPackageDrawer({
  pkg,
  onClose,
  onSuccess,
}) {
  const { updatePackage } = usePackages()

  const [form, setForm] = useState({
    name: "",
    price: 0,
    duration: 30,
    bonusDays: 0,
    gradient: "from-indigo-500 to-indigo-700",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (pkg) {
      setForm({
        name: pkg.name || "",
        price: pkg.price || 0,
        duration: pkg.duration || 30,
        bonusDays: pkg.bonusDays || 0,
        gradient:
          pkg.gradient || "from-indigo-500 to-indigo-700",
      })
    }
  }, [pkg])

  // 🔒 TOTAL DAYS
  const totalDays = useMemo(() => {
    return (
      Number(form.duration || 0) +
      Number(form.bonusDays || 0)
    )
  }, [form.duration, form.bonusDays])

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = "Package name required"
    }

    if (Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0"
    }

    if (Number(form.duration) <= 0) {
      newErrors.duration = "Duration must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return

    updatePackage(pkg.id, {
      ...form,
      price: Number(form.price),
      duration: Number(form.duration),
      bonusDays: Number(form.bonusDays),

      // 🔒 Anti-abuse model
      isUnlimited: false,
      visitLimit: totalDays,
    })

    if (onSuccess) onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-[420px] bg-[#0F172A] p-6 border-l border-white/10 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-semibold text-lg">
            Edit Package
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="space-y-4">

          <div>
            <label className="text-xs text-gray-400">Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="mt-1 w-full bg-gray-800 rounded px-3 py-2 text-white"
            />
            {errors.name && (
              <div className="text-red-400 text-xs mt-1">
                {errors.name}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-400">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="mt-1 w-full bg-gray-800 rounded px-3 py-2 text-white"
            />
            {errors.price && (
              <div className="text-red-400 text-xs mt-1">
                {errors.price}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-400">
              Duration (days)
            </label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
              className="mt-1 w-full bg-gray-800 rounded px-3 py-2 text-white"
            />
            {errors.duration && (
              <div className="text-red-400 text-xs mt-1">
                {errors.duration}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-400">
              Bonus Days
            </label>
            <input
              type="number"
              value={form.bonusDays}
              onChange={(e) =>
                setForm({
                  ...form,
                  bonusDays: e.target.value,
                })
              }
              className="mt-1 w-full bg-gray-800 rounded px-3 py-2 text-white"
            />
          </div>

          {/* 🔒 AUTO VISIT INFO */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-400">
            Maximum visits automatically equals total days.
            <div className="mt-1 text-white font-medium">
              {totalDays} visits
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  )
}