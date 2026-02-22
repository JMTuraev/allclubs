import { CheckIcon } from "@heroicons/react/20/solid"

const tiers = [
  {
    name: "Месячный тариф",
    id: "monthly",
    price: "300 000",
    period: "в месяц",
    description: "Полный доступ ко всем функциям системы управления фитнес-клубом.",
    features: [
      "Учет клиентов и абонементов",
      "Контроль посещений",
      "Управление шкафчиками",
      "Финансовая статистика",
      "Техническая поддержка",
    ],
    popular: false,
  },
  {
    name: "Годовой тариф",
    id: "yearly",
    price: "3 000 000",
    period: "в год",
    description: "Максимальная выгода при оплате за год. Экономия 600 000 сум.",
    features: [
      "Все функции месячного тарифа",
      "Приоритетная поддержка",
      "Расширенная аналитика",
      "Ранний доступ к новым функциям",
    ],
    popular: true,
  },
]

export default function Pricing() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-base font-semibold text-indigo-400">
          Тарифы
        </h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Выберите подходящий тариф
        </p>
        <p className="mt-6 text-lg text-gray-400">
          Простая и прозрачная система оплаты без скрытых платежей.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 px-6 lg:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`flex flex-col justify-between rounded-3xl p-8 shadow-xl ${
              tier.popular
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold">
                {tier.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold">
                  {tier.price}
                </span>
                <span className="text-sm">
                  сум / {tier.period}
                </span>
              </div>

              <p className="mt-4 text-sm opacity-80">
                {tier.description}
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-5 w-5 flex-none" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className={`mt-8 rounded-md px-4 py-2 text-sm font-semibold transition ${
                tier.popular
                  ? "bg-white text-indigo-600 hover:bg-gray-200"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              Подключить
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}