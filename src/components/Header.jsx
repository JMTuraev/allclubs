import {
  Bars3Icon,
  BellIcon,
  CubeIcon,
} from "@heroicons/react/24/outline"

import {
  PlusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/20/solid"

import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom"

import Filter from "./Filter"

export default function Header({ setSidebarOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const path = location.pathname
  const urlDate = searchParams.get("date")

  const isSessionsPage = path === "/app/sessions"
  const isFinancePage = path === "/app/finance"
  const isPackagesPage = path === "/app/packages"
  const isCreatePackagePage = path === "/app/packages/create"

  const isStaffPage = path === "/app/staffs"
  const isCreateStaffPage = path === "/app/staffs/create"

  const isClientsPage = path === "/app/clients"
  const isCreateClientPage = path === "/app/clients/create"

  /* ================= OPEN BAR NEW TAB ================= */

  const openBar = () => {
    const url = window.location.origin + "/bar"
    window.open(url, "_blank", "noopener,noreferrer")
  }

  /* ================= FORMAT DATE ================= */

  const formattedDate = (() => {
    if (!urlDate) return null

    const d = new Date(urlDate)

    return d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  })()

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center border-b border-white/10 bg-gray-900 px-6">

      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-4">

        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-white hover:text-gray-300 transition"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {isSessionsPage && (
          <h1 className="text-lg font-semibold text-white">
            Sessions
          </h1>
        )}

        {isCreatePackagePage && (
          <HeaderBack title="Создать тариф" navigate={navigate} />
        )}

        {isCreateStaffPage && (
          <HeaderBack title="Новый сотрудник" navigate={navigate} />
        )}

        {isCreateClientPage && (
          <HeaderBack title="Новый клиент" navigate={navigate} />
        )}
      </div>

      {/* ================= RIGHT ================= */}
      <div className="ml-auto flex items-center gap-6">

        {/* FILTER ZONE */}
        {(isSessionsPage || isFinancePage) && (
          <>
            {formattedDate ? (
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                {formattedDate}
              </div>
            ) : (
              <Filter onChange={() => {}} />
            )}
          </>
        )}

        {isPackagesPage && (
          <CreateButton
            text="Создать тариф"
            color="indigo"
            onClick={() => navigate("/app/packages/create")}
          />
        )}

        {isStaffPage && (
          <CreateButton
            text="Новый сотрудник"
            color="emerald"
            onClick={() => navigate("/app/staffs/create")}
          />
        )}

        {isClientsPage && (
          <CreateButton
            text="Новый клиент"
            color="violet"
            onClick={() => navigate("/app/clients/create")}
          />
        )}

        {/* BAR NEW TAB */}
        <button
          onClick={openBar}
          className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
          title="Open Bar"
        >
          <CubeIcon className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <BellIcon className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition" />

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition">
            Owner
          </span>
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="h-9 w-9 rounded-full border border-white/10 group-hover:border-indigo-500 transition"
          />
        </div>

      </div>
    </div>
  )
}

/* ================= BACK HEADER ================= */

function HeaderBack({ title, navigate }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
      >
        <ArrowLeftIcon className="h-5 w-5 text-white" />
      </button>

      <h1 className="text-lg font-semibold text-white">
        {title}
      </h1>
    </div>
  )
}

/* ================= CREATE BUTTON ================= */

function CreateButton({ text, color, onClick }) {
  const colors = {
    indigo:
      "from-indigo-600 to-indigo-500 shadow-indigo-600/20 hover:shadow-indigo-500/40",
    emerald:
      "from-emerald-600 to-emerald-500 shadow-emerald-600/20 hover:shadow-emerald-500/40",
    violet:
      "from-violet-600 to-violet-500 shadow-violet-600/20 hover:shadow-violet-500/40",
  }

  return (
    <button
      onClick={onClick}
      className={`
        hidden sm:flex items-center gap-2
        rounded-lg
        bg-gradient-to-r ${colors[color]}
        px-4 py-2
        text-sm font-semibold text-white
        shadow-lg
        hover:scale-105
        active:scale-95
        transition-all duration-300
      `}
    >
      <PlusIcon className="h-5 w-5" />
      {text}
    </button>
  )
}