import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  EllipsisVerticalIcon,
  CalendarDaysIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/20/solid"

const packages = [
  {
    id: 1,
    name: "1 месяц",
    duration: 30,
    price: 300000,
    type: "Безлимит",
    gender: "all",
    description: "Полный доступ ко всем тренировкам клуба.",
    gradient: "from-indigo-500 to-indigo-700",
  },
  {
    id: 2,
    name: "3 месяца",
    duration: 90,
    price: 800000,
    type: "Безлимит",
    gender: "female",
    description: "Оптимальный выбор для регулярных клиентов.",
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    id: 3,
    name: "6 месяцев",
    duration: 180,
    price: 1500000,
    type: "Безлимит",
    gender: "male",
    description: "Максимальная выгода и стабильный прогресс.",
    gradient: "from-rose-500 to-rose-700",
  },
]

const getGenderInfo = (gender) => {
  switch (gender) {
    case "male":
      return {
        label: "Только мужчины",
        icon: <UserIcon className="size-4 text-sky-400" />,
      }
    case "female":
      return {
        label: "Только женщины",
        icon: <UserIcon className="size-4 text-pink-400" />,
      }
    default:
      return {
        label: "Для всех",
        icon: <UsersIcon className="size-4 text-emerald-400" />,
      }
  }
}

export default function PackageList() {
  return (
    <ul
      className="
      grid grid-cols-2 
      sm:grid-cols-2 
      md:grid-cols-3 
      lg:grid-cols-4 
      gap-4 sm:gap-6
    "
    >
      {packages.map((pkg) => {
        const genderInfo = getGenderInfo(pkg.gender)

        return (
          <li
            key={pkg.id}
            className="
            relative rounded-xl 
            bg-gray-800/60 
            p-4 sm:p-6
            shadow-lg 
            outline outline-white/10 
            hover:scale-[1.02] 
            transition-all duration-300
          "
          >
            {/* 3 DOT MENU */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
              <Menu as="div" className="relative">
                <MenuButton className="text-gray-400 hover:text-white">
                  <EllipsisVerticalIcon className="size-5" />
                </MenuButton>

                <MenuItems
                  className="
                  absolute right-0 mt-2 w-28 
                  rounded-md bg-gray-900 
                  shadow-xl outline outline-white/10 
                  p-1 z-20
                "
                >
                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                          active ? "bg-white/10" : ""
                        }`}
                      >
                        Edit
                      </button>
                    )}
                  </MenuItem>

                  <MenuItem>
                    {({ active }) => (
                      <button
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md text-rose-400 ${
                          active ? "bg-white/10" : ""
                        }`}
                      >
                        Delete
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            {/* GRADIENT CIRCLE */}
            <div
              className={`
              mx-auto flex 
              size-14 sm:size-20 md:size-24
              items-center justify-center 
              rounded-full 
              bg-gradient-to-br ${pkg.gradient}
              shadow-xl
            `}
            >
              <span className="text-base sm:text-xl md:text-2xl font-bold text-white">
                {pkg.duration}
              </span>
            </div>

            {/* NAME */}
            <h3 className="mt-4 sm:mt-6 text-center text-sm sm:text-lg font-semibold text-white">
              {pkg.name}
            </h3>

            {/* PRICE */}
            <div className="mt-2 flex items-center justify-center gap-2">
              <CurrencyDollarIcon className="size-4 sm:size-5 text-gray-400" />
              <p className="text-base sm:text-xl font-bold text-white text-center">
                {pkg.price.toLocaleString("ru-RU")} сум
              </p>
            </div>

            {/* DESCRIPTION */}
            <p
              className="
              mt-3 sm:mt-4 
              text-xs sm:text-sm 
              text-gray-400 
              text-center 
              line-clamp-2
            "
            >
              {pkg.description}
            </p>

            {/* INFO */}
            <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2 justify-center">
                <CalendarDaysIcon className="size-4" />
                <span>{pkg.duration} дней</span>
              </div>

              <div className="flex items-center gap-2 justify-center">
                <InformationCircleIcon className="size-4" />
                <span>{pkg.type}</span>
              </div>

              <div className="flex items-center gap-2 justify-center">
                {genderInfo.icon}
                <span>{genderInfo.label}</span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}