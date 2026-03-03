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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  clients = [],
  packages = [],
  activeSessions = [],
  todayActivePackages = [],
}) {
  const location = useLocation()

  return (
    <>
      {/* ================= MOBILE ================= */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="lg:hidden">
        <div className="fixed inset-0 bg-black/70" />
        <Dialog.Panel className="fixed inset-y-0 left-0 w-64 bg-gray-900 px-4 py-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="mb-4"
          >
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>

          <NavContent
            location={location}
            clients={clients}
            packages={packages}
            activeSessions={activeSessions}
            todayActivePackages={todayActivePackages}
          />
        </Dialog.Panel>
      </Dialog>

      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-56 lg:flex-col bg-gray-900 px-4 py-4 border-r border-white/5">
        <NavContent
          location={location}
          clients={clients}
          packages={packages}
          activeSessions={activeSessions}
          todayActivePackages={todayActivePackages}
        />
      </div>
    </>
  )
}

function NavContent({
  location,
  clients,
  packages,
  activeSessions,
  todayActivePackages,
}) {
  const navigation = [
    { name: "Dashboard", to: "/app/dashboard", icon: HomeIcon },

    {
      name: "Clients",
      to: "/app/clients",
      icon: UsersIcon,
      count: clients.length,
    },

    {
      name: "Sessions",
      to: "/app/sessions",
      icon: CalendarIcon,
      greenCount: activeSessions.length,
    },

    { name: "Finance", to: "/app/finance", icon: ChartPieIcon },

    {
      name: "Packages",
      to: "/app/packages",
      icon: CubeIcon,
      count: packages.length,
      greenCount: todayActivePackages.length,
    },

    { name: "Staffs", to: "/app/staffs", icon: UsersIcon },
    { name: "Audit", to: "/app/audit", icon: UsersIcon },
  ]

  return (
    <nav className="flex flex-col h-full">
      {/* LOGO */}
      <h1 className="text-lg font-semibold mb-6 text-white tracking-wide">
        ALLCLUBS
      </h1>

      {/* NAV ITEMS */}
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
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition"
                )}
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.name}
                </div>

                {/* BADGES */}
                <div className="flex items-center gap-2">

                  {/* DEFAULT COUNT BADGE */}
                  {typeof item.count === "number" && (
                    <span className="bg-white/10 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}

                  {/* GREEN BADGE */}
                  {typeof item.greenCount === "number" &&
                    item.greenCount > 0 && (
                      <span className="bg-emerald-600/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                        {item.greenCount}
                      </span>
                    )}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* SETTINGS */}
      <div className="mt-auto pt-4 border-t border-white/5">
        <button className="flex items-center gap-3 text-gray-500 hover:text-white text-sm transition">
          <Cog6ToothIcon className="h-5 w-5" />
          Settings
        </button>
      </div>
    </nav>
  )
}