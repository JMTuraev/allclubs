import { useState } from "react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import {
  EllipsisVerticalIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid"

import { usePackages } from "../../modules/packages/domain/PackagesContext"
import EditPackageDrawer from "../../modules/packages/ui/EditPackageDrawer"
import Toast from "../../components/ui/Toast"

export default function PackageList() {
  const { packages, deletePackage } = usePackages()

  const [confirmId, setConfirmId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [showToast, setShowToast] = useState(false)

  return (
    <>
      <div className="px-6 py-6">
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {packages.map((pkg) => (
            <li
              key={pkg.id}
              className="relative rounded-2xl bg-gray-800/70 border border-white/10 p-5 shadow-lg aspect-square flex flex-col justify-between transition hover:scale-[1.02]"
            >
              {/* ARCHIVED BADGE */}
              {pkg.archived && (
                <div className="absolute top-3 left-3 text-xs bg-rose-600 px-2 py-1 rounded">
                  Archived
                </div>
              )}

              {/* MENU */}
              <div className="absolute top-3 right-3">
                <Menu>
                  <MenuButton>
                    <EllipsisVerticalIcon className="size-5 text-gray-400 hover:text-white" />
                  </MenuButton>

                  <MenuItems className="absolute right-0 mt-2 w-36 rounded-md bg-gray-900 shadow-xl outline outline-white/10 p-1 z-20">
                    {/* EDIT */}
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => setEditing(pkg)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md text-white flex items-center gap-2 ${
                            active ? "bg-white/10" : ""
                          }`}
                        >
                          <PencilIcon className="size-4" />
                          Edit
                        </button>
                      )}
                    </MenuItem>

                    {/* DELETE */}
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => setConfirmId(pkg.id)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md text-rose-400 flex items-center gap-2 ${
                            active ? "bg-white/10" : ""
                          }`}
                        >
                          <TrashIcon className="size-4" />
                          Delete
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>

              {/* CONTENT */}
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

        {/* DELETE CONFIRM */}
        {confirmId && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#111827] w-[380px] rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="text-lg font-semibold text-white">
                Delete Package?
              </div>

              <div className="text-sm text-gray-400">
                This will archive the package. Active clients will not be affected.
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setConfirmId(null)}
                  className="px-4 py-2 bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    deletePackage(confirmId)
                    setConfirmId(null)
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT DRAWER */}
        {editing && (
          <EditPackageDrawer
            pkg={editing}
            onClose={() => setEditing(null)}
            onSuccess={() => setShowToast(true)} // 🔥 Toast signal
          />
        )}
      </div>

      {/* GLOBAL TOAST */}
      {showToast && (
        <Toast
          message="Package updated successfully"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
} 