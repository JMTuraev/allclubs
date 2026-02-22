import { Dialog } from "@headlessui/react"
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { Link, useLocation } from "react-router-dom"

const navigation = [
  { name: "Dashboard", to: "/app/dashboard", icon: HomeIcon },
  { name: "Clients", to: "/app/clients", icon: UsersIcon },
  { name: "Sessions", to: "/app/sessions", icon: CalendarIcon },
  { name: "Finance", to: "/app/finance", icon: ChartPieIcon },
  { name: "Packages", to: "/app/packages", icon: ChartPieIcon },
  { name: "Staffs", to: "/app/staffs", icon: ChartPieIcon },
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
        <Dialog.Panel className="fixed inset-y-0 left-0 w-72 bg-gray-800 p-6">
          <button onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
          <NavContent location={location} />
        </Dialog.Panel>
      </Dialog>

      {/* Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-gray-800 p-6">
        <NavContent location={location} />
      </div>
    </>
  )
}

function NavContent({ location }) {
  return (
    <nav className="flex flex-col h-full">
      <h1 className="text-xl font-bold mb-8">ALLCLUBS</h1>

      <ul className="space-y-2">
        {navigation.map((item) => {
          const active = location.pathname === item.to
          return (
            <li key={item.name}>
              <Link
                to={item.to}
                className={classNames(
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-700",
                  "flex items-center gap-3 rounded-md p-2 text-sm font-semibold"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto">
        <button className="flex items-center gap-3 text-gray-400 hover:text-white">
          <Cog6ToothIcon className="h-5 w-5" />
          Settings
        </button>
      </div>
    </nav>
  )
}