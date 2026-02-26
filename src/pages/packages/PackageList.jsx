import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  EllipsisVerticalIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from "@heroicons/react/20/solid"
import { usePackages } from "../../modules/packages/domain/PackagesContext"

export default function PackageList() {
  const { packages, deletePackage } = usePackages()

  return (
    <div className="px-6 py-6">
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {packages.map((pkg) => (
          <li
            key={pkg.id}
            className="relative rounded-2xl bg-gray-800/70 border border-white/10 p-5 shadow-lg aspect-square flex flex-col justify-between"
          >
            <div className="absolute top-3 right-3">
              <Menu>
                <MenuButton>
                  <EllipsisVerticalIcon className="size-5 text-gray-400 hover:text-white" />
                </MenuButton>
                <MenuItems className="absolute right-0 mt-2 w-28 rounded-md bg-gray-900 shadow-xl outline outline-white/10 p-1 z-20">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md text-rose-400 ${
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

            <div className="text-center">
              <div
                className={`mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br ${pkg.gradient}`}
              >
                <span className="text-white text-lg font-bold">
                  {pkg.isUnlimited ? "∞" : pkg.visitLimit}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-semibold text-white">
                {pkg.name}
              </h3>

              <div className="mt-1 flex justify-center items-center gap-1 text-xs text-gray-400">
                <CurrencyDollarIcon className="size-4" />
                {pkg.price.toLocaleString("ru-RU")} сум
              </div>
            </div>

            <div className="text-xs text-gray-400 space-y-1 mt-3 text-center">
              <div className="flex justify-center items-center gap-1">
                <CalendarDaysIcon className="size-4" />
                {pkg.duration} дней
              </div>

              <div className="flex justify-center items-center gap-1">
                <UsersIcon className="size-4" />
                {pkg.isUnlimited
                  ? "Безлимит"
                  : `${pkg.visitLimit} посещений`}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}