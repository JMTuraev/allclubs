import { Dialog } from "@headlessui/react"
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  ChartPieIcon,
  CubeIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { Link, useLocation } from "react-router-dom"

const navigation = [
  { name: "Dashboard", to: "/app/dashboard", icon: HomeIcon },
  { name: "Clients", to: "/app/clients", icon: UsersIcon },
  { name: "Sessions", to: "/app/sessions", icon: CalendarIcon },
  { name: "Finance", to: "/app/finance", icon: ChartPieIcon },
  { name: "Packages", to: "/app/packages", icon: CubeIcon },
  { name: "Staffs", to: "/app/staffs", icon: UsersIcon },
  { name: "Audit", to: "/app/audit", icon: UsersIcon },
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
        <Dialog.Panel className="fixed inset-y-0 left-0 w-64 bg-gray-900 px-4 py-4">
          <button onClick={() => setSidebarOpen(false)} className="mb-4">
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
          <NavContent location={location} />
        </Dialog.Panel>
      </Dialog>

      {/* Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-56 lg:flex-col bg-gray-900 px-4 py-4 border-r border-white/5">
        <NavContent location={location} />
      </div>
    </>
  )
}

function NavContent({ location }) {
  return (
    <nav className="flex flex-col h-full">
      <h1 className="text-lg font-semibold mb-6 text-white tracking-wide">
        ALLCLUBS
      </h1>

      <ul className="space-y-1">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to + "/")

          return (
            <li key={item.name}>
              <Link
                to={item.to}
                className={classNames(
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto pt-4 border-t border-white/5">
        <button className="flex items-center gap-3 text-gray-500 hover:text-white text-sm transition">
          <Cog6ToothIcon className="h-5 w-5" />
          Settings
        </button>
      </div>
    </nav>
  )
}