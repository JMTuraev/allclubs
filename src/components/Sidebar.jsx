import { Dialog, Disclosure } from "@headlessui/react"
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  ChartPieIcon,
  CubeIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import { Link, useLocation } from "react-router-dom"

const navigation = [
  { name: "Dashboard", to: "/app/dashboard", icon: HomeIcon },
  { name: "Clients", to: "/app/clients", icon: UsersIcon },
  { name: "Sessions", to: "/app/sessions", icon: CalendarIcon },
  { name: "Finance", to: "/app/finance", icon: ChartPieIcon },
  { name: "Packages", to: "/app/packages", icon: CubeIcon },
  { name: "Staffs", to: "/app/staffs", icon: UsersIcon },
  {
    name: "Bar",
    icon: CubeIcon,
    children: [
      { name: "New Product", to: "/app/bar/new" },
      { name: "Incoming Goods", to: "/app/bar/incoming" },
      { name: "Statistics", to: "/app/bar/statistics" },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="lg:hidden">
        <div className="fixed inset-0 bg-black/70" />
        <Dialog.Panel className="fixed inset-y-0 left-0 w-72 bg-gray-900 p-6">
          <button onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
          <NavContent location={location} />
        </Dialog.Panel>
      </Dialog>

      {/* Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-gray-900 p-6 border-r border-white/5">
        <NavContent location={location} />
      </div>
    </>
  )
}

function NavContent({ location }) {
  return (
    <nav className="flex flex-col h-full">
      <h1 className="text-xl font-bold mb-8 text-white tracking-wide">
        ALLCLUBS
      </h1>

      <ul className="space-y-1">
        {navigation.map((item) => {
          const isActive =
            item.to && location.pathname === item.to

          const hasChildren = item.children

          if (!hasChildren) {
            return (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={classNames(
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          }

          // Dropdown (Bar)
          const isChildActive = item.children.some((sub) =>
            location.pathname.startsWith(sub.to)
          )

          return (
            <li key={item.name}>
              <Disclosure defaultOpen={isChildActive}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        isChildActive
                          ? "bg-indigo-600 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white",
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </div>
                      <ChevronRightIcon
                        className={classNames(
                          open ? "rotate-90 text-white" : "text-gray-500",
                          "h-4 w-4 transition-transform duration-200"
                        )}
                      />
                    </Disclosure.Button>

                    <Disclosure.Panel className="mt-1 space-y-1 pl-10">
                      {item.children.map((sub) => {
                        const active =
                          location.pathname === sub.to

                        return (
                          <Link
                            key={sub.name}
                            to={sub.to}
                            className={classNames(
                              active
                                ? "text-indigo-400"
                                : "text-gray-500 hover:text-white",
                              "block py-1 text-sm transition"
                            )}
                          >
                            {sub.name}
                          </Link>
                        )
                      })}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button className="flex items-center gap-3 text-gray-500 hover:text-white transition">
          <Cog6ToothIcon className="h-5 w-5" />
          Settings
        </button>
      </div>
    </nav>
  )
}