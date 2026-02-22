import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeftIcon,
  UsersIcon,
  UserIcon,
  CheckIcon,
} from "@heroicons/react/20/solid"

const gradients = [
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
  "from-purple-500 to-purple-700",
  "from-amber-500 to-amber-700",
  "from-cyan-500 to-cyan-700",
  "from-pink-500 to-pink-700",
  "from-orange-500 to-orange-700",
  "from-teal-500 to-teal-700",
  "from-fuchsia-500 to-fuchsia-700",
  "from-red-500 to-red-700",
]

export default function CreatePackage() {
  const navigate = useNavigate()

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

  return (
    <div className="px-8 py-10">

    

      {/* ===== FORM CARD ===== */}
      <div
        className="
        max-w-3xl mx-auto
        bg-gradient-to-b from-gray-800/70 to-gray-900/80
        backdrop-blur-xl
        rounded-2xl
        border border-white/10
        shadow-2xl shadow-black/40
        p-10
        space-y-10
      "
      >

        {/* BASIC INFO */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-400">
              Название тарифа
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Цена (сум)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* DURATION */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-gray-400">
              Длительность (дней)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Бонус дней
            </label>
            <input
              type="number"
              value={bonusDays}
              onChange={(e) => setBonusDays(e.target.value)}
              className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-3 text-white"
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="rounded-lg bg-indigo-600/10 border border-indigo-500/20 p-4 text-center">
              <p className="text-xs text-gray-400">Итого</p>
              <p className="text-xl font-bold text-indigo-400">
                {totalDays} дней
              </p>
            </div>
          </div>
        </div>

        {/* TIME LIMIT */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-400">
              Начало посещения
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Конец посещения
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-3 text-white"
            />
          </div>
        </div>

        {/* FREEZE */}
        <div className="space-y-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-white">
                Заморозка абонемента
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Клиент может временно приостановить тариф
              </p>
            </div>

            <button
              onClick={() => setFreezeEnabled(!freezeEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                freezeEnabled ? "bg-indigo-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  freezeEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {freezeEnabled && (
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400">
                Макс. дней
              </label>
              <input
                type="number"
                value={maxFreezeDays}
                onChange={(e) => setMaxFreezeDays(e.target.value)}
                className="w-28 rounded-lg bg-gray-900 border border-white/10 px-3 py-2 text-white"
              />
            </div>
          )}
        </div>

        {/* GENDER */}
        <div>
          <label className="text-sm text-gray-400">
            Для кого
          </label>

          <div className="mt-3 grid grid-cols-3 gap-3">

            <button
              onClick={() => setGender("all")}
              className={`flex items-center justify-center gap-2 rounded-lg p-3 transition ${
                gender === "all"
                  ? "bg-indigo-600/20 border border-indigo-500"
                  : "bg-white/5"
              }`}
            >
              <UsersIcon className="h-5 w-5 text-emerald-400" />
              Все
            </button>

            <button
              onClick={() => setGender("male")}
              className={`flex items-center justify-center gap-2 rounded-lg p-3 transition ${
                gender === "male"
                  ? "bg-indigo-600/20 border border-indigo-500"
                  : "bg-white/5"
              }`}
            >
              <UserIcon className="h-5 w-5 text-sky-400" />
              Мужчины
            </button>

            <button
              onClick={() => setGender("female")}
              className={`flex items-center justify-center gap-2 rounded-lg p-3 transition ${
                gender === "female"
                  ? "bg-indigo-600/20 border border-indigo-500"
                  : "bg-white/5"
              }`}
            >
              <UserIcon className="h-5 w-5 text-pink-400" />
              Женщины
            </button>

          </div>
        </div>

        {/* COLOR PICKER */}
        <div>
          <label className="text-sm text-gray-400">
            Цвет карточки
          </label>

          <div className="mt-4 grid grid-cols-6 gap-4">
            {gradients.map((gradient, i) => (
              <button
                key={i}
                onClick={() => setSelectedGradient(gradient)}
                className={`
                  relative h-14 rounded-xl
                  bg-gradient-to-br ${gradient}
                  shadow-lg
                  hover:scale-105
                  transition
                  ${selectedGradient === gradient ? "ring-2 ring-white" : ""}
                `}
              >
                {selectedGradient === gradient && (
                  <CheckIcon className="absolute inset-0 m-auto h-6 w-6 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* PREVIEW */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-gray-900/60 p-8 text-center">
          <p className="text-sm text-gray-400 mb-6">
            Превью тарифа
          </p>

          <div className="flex justify-center">
            <div className="w-64 rounded-2xl bg-gray-800 p-6 shadow-xl">
              <div
                className={`mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br ${selectedGradient}`}
              >
                <span className="text-white font-bold text-2xl">
                  {totalDays}
                </span>
              </div>

              <p className="mt-6 text-white font-semibold text-lg">
                {name || "Название тарифа"}
              </p>

              <p className="mt-2 text-gray-400 text-sm">
                {price
                  ? Number(price).toLocaleString("ru-RU") + " сум"
                  : "Цена"}
              </p>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          className="
          w-full rounded-xl
          bg-gradient-to-r from-indigo-600 to-indigo-500
          py-4 font-semibold text-white
          shadow-lg shadow-indigo-600/30
          hover:scale-[1.02]
          transition
        "
        >
          Создать тариф
        </button>

      </div>
    </div>
  )
}