import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { usePackages } from "../../modules/packages/domain/PackagesContext"

const gradients = [
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
  "from-purple-500 to-purple-700",
  "from-amber-500 to-amber-700",
]

export default function CreatePackage() {
  const navigate = useNavigate()
  const { addPackage } = usePackages()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState(30)
  const [bonusDays, setBonusDays] = useState(0)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [freezeEnabled, setFreezeEnabled] = useState(false)
  const [maxFreezeDays, setMaxFreezeDays] = useState(0)
  const [gender, setGender] = useState("all")
  const [selectedGradient, setSelectedGradient] = useState(gradients[0])

  const totalDays = useMemo(() => {
    return Number(duration || 0) + Number(bonusDays || 0)
  }, [duration, bonusDays])

  const handleSubmit = () => {
    addPackage({
      name,
      price: Number(price),
      duration: Number(duration),
      bonusDays: Number(bonusDays),
      startTime: startTime || null,
      endTime: endTime || null,
      freezeEnabled,
      maxFreezeDays: freezeEnabled ? Number(maxFreezeDays) : 0,
      gender,
      gradient: selectedGradient,
      type: "Безлимит",
      description: "",
    })

    navigate("/app/packages")
  }

  return (
    <div className="px-8 py-6">
      <div className="max-w-5xl mx-auto bg-gray-900/70 border border-white/10 rounded-2xl p-8">

        {/* ===== TOP PREVIEW ===== */}
        <div className="flex items-center justify-between mb-10">

          {/* Circle */}
          <div className="flex items-center gap-8">

            <div
              className={`h-32 w-32 rounded-full bg-gradient-to-br ${selectedGradient} flex items-center justify-center shadow-xl`}
            >
              <span className="text-3xl font-bold text-white">
                {totalDays}
              </span>
            </div>

            {/* Color picker */}
            <div>
              <p className="text-xs text-gray-400 mb-3">
                Цвет карточки
              </p>

              <div className="flex gap-3">
                {gradients.map((gradient, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setSelectedGradient(gradient)
                    }
                    className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradient} transition ${
                      selectedGradient === gradient
                        ? "ring-2 ring-white scale-110"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Create button small */}
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500 transition"
          >
            Создать
          </button>
        </div>

        {/* ===== FORM ===== */}
        <div className="grid grid-cols-2 gap-8 text-sm">

          {/* LEFT */}
          <div className="space-y-5">

            <div>
              <label className="text-xs text-gray-400">
                Название
              </label>
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="mt-1 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">
                Цена (сум)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                className="mt-1 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">
                  Дней
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  className="mt-1 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">
                  Бонус
                </label>
                <input
                  type="number"
                  value={bonusDays}
                  onChange={(e) =>
                    setBonusDays(e.target.value)
                  }
                  className="mt-1 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">
                  С
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) =>
                    setStartTime(e.target.value)
                  }
                  className="mt-1 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">
                  До
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(e.target.value)
                  }
                  className="mt-1 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            {/* Freeze */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white">
                  Заморозка
                </span>

                <button
                  onClick={() =>
                    setFreezeEnabled(!freezeEnabled)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    freezeEnabled
                      ? "bg-indigo-600"
                      : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      freezeEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {freezeEnabled && (
                <input
                  type="number"
                  value={maxFreezeDays}
                  onChange={(e) =>
                    setMaxFreezeDays(e.target.value)
                  }
                  placeholder="Макс. дней"
                  className="mt-3 w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                />
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs text-gray-400">
                Для кого
              </label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {["all", "male", "female"].map(
                  (g) => (
                    <button
                      key={g}
                      onClick={() =>
                        setGender(g)
                      }
                      className={`py-2 rounded-lg text-sm transition ${
                        gender === g
                          ? "bg-indigo-600 text-white"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {g === "all"
                        ? "Все"
                        : g === "male"
                        ? "Муж"
                        : "Жен"}
                    </button>
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}