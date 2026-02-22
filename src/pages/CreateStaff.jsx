import { useState } from "react"
import { CameraIcon } from "@heroicons/react/24/outline"

export default function CreateStaff() {
  const [role, setRole] = useState("manager")
  const [percent, setPercent] = useState(30)
  const [duration, setDuration] = useState(1)

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [packagePrice, setPackagePrice] = useState("")

  const handleSubmit = () => {
    const payload = {
      fullName,
      phone,
      email,
      role,
      trainerSettings:
        role === "trainer"
          ? {
              percent,
              packagePrice: Number(packagePrice),
              durationHours: duration,
            }
          : null,
      isActive: true,
    }

    console.log("SEND TO SERVER:", payload)
  }

  return (
    <div className="px-8 py-8">
      <div className="max-w-2xl mx-auto">

        <div className="
          bg-gradient-to-br from-gray-800 to-gray-900
          border border-white/10
          rounded-2xl
          shadow-xl
          p-8
          space-y-8
        ">

          {/* AVATAR */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gray-700 border border-white/10 flex items-center justify-center text-gray-400">
                Фото
              </div>

              <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-500 transition">
                <CameraIcon className="h-4 w-4 text-white" />
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>

          {/* NAME */}
          <div>
            <label className="text-xs text-gray-400">ФИО</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-xs text-gray-400">Телефон</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-400">
              Gmail (логин сотрудника)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@gmail.com"
              className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-xs text-gray-400">
              Тип сотрудника
            </label>

            <div className="mt-2 grid grid-cols-2 bg-gray-900 rounded-xl border border-white/10 p-1">
              <button
                onClick={() => setRole("manager")}
                className={`rounded-lg py-2.5 text-sm font-medium transition ${
                  role === "manager"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400"
                }`}
              >
                Manager
              </button>

              <button
                onClick={() => setRole("trainer")}
                className={`rounded-lg py-2.5 text-sm font-medium transition ${
                  role === "trainer"
                    ? "bg-amber-600 text-white"
                    : "text-gray-400"
                }`}
              >
                Trainer
              </button>
            </div>
          </div>

          {/* TRAINER SETTINGS */}
          {role === "trainer" && (
            <div className="border-t border-white/10 pt-6 space-y-6">

              {/* PERCENT RANGE */}
              <div>
                <label className="text-xs text-gray-400">
                  Процент тренера
                </label>

                <input
                  type="range"
                  min="5"
                  max="90"
                  step="5"
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value))}
                  className="w-full mt-4 accent-amber-500"
                />

                <div className="flex justify-between text-sm mt-2">
                  <span className="text-amber-400 font-semibold">
                    {percent}% тренеру
                  </span>
                  <span className="text-indigo-400 font-semibold">
                    {100 - percent}% владельцу
                  </span>
                </div>
              </div>

              {/* PACKAGE PRICE */}
              <div>
                <label className="text-xs text-gray-400">
                  Стоимость 1 пакета (сум)
                </label>
                <input
                  type="number"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(e.target.value)}
                  className="mt-2 w-full rounded-lg bg-gray-900 border border-white/10 px-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* DURATION RANGE */}
              <div>
                <label className="text-xs text-gray-400">
                  Длительность пакета (часов)
                </label>

                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full mt-4 accent-indigo-500"
                />

                <div className="text-sm mt-2 text-indigo-400 font-semibold">
                  {duration} час(а)
                </div>
              </div>

            </div>
          )}

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.02] transition"
          >
            Создать сотрудника
          </button>

        </div>
      </div>
    </div>
  )
}