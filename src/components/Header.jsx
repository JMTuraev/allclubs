import {
  Bars3Icon,
  BellIcon,
  CubeIcon,
  UserPlusIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline"

import { ArrowLeftIcon } from "@heroicons/react/20/solid"

import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom"

import Filter from "./Filter"

export default function Header({ setSidebarOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const path = location.pathname
  const urlDate = searchParams.get("date")

  const isSessionsPage = path === "/app/sessions"
  const isFinancePage = path === "/app/finance"

  const isPackagesPage = path.startsWith("/app/packages")
  const isCreatePackagePage = path === "/app/packages/create"

  const isStaffPage = path === "/app/staffs"
  const isCreateStaffPage = path === "/app/staffs/create"

  const isClientsPage = path === "/app/clients"
  const isCreateClientPage = path === "/app/clients/create"

  const activeTab = searchParams.get("tab") || "templates"

  const changeTab = (tab) => {
    setSearchParams({ tab })
  }

  const openBar = () => {
    const url = window.location.origin + "/bar"
    window.open(url, "_blank", "noopener,noreferrer")
  }

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
      
      {/* LEFT */}
      <div className="flex items-center gap-6">

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

        {/* PACKAGES TABS */}
        {isPackagesPage && !isCreatePackagePage && (
          <div className="flex gap-3 ml-4">

            <button
              onClick={() => changeTab("templates")}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  activeTab === "templates"
                    ? "bg-indigo-600/20 text-indigo-400"
                    : "text-gray-400 hover:text-white"
                }
              `}
            >
              Package Templates
            </button>

            <button
              onClick={() => changeTab("sold")}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  activeTab === "sold"
                    ? "bg-indigo-600/20 text-indigo-400"
                    : "text-gray-400 hover:text-white"
                }
              `}
            >
              Sold Packages
            </button>

          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-6">

        {(isSessionsPage || isFinancePage) && (
          formattedDate ? (
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
              {formattedDate}
            </div>
          ) : (
            <Filter onChange={() => {}} />
          )
        )}

        {isPackagesPage && !isCreatePackagePage && (
          <CreateButton
            text="Создать тариф"
            icon={CubeIcon}
            onClick={() => navigate("/app/packages/create")}
          />
        )}

        {isStaffPage && (
          <CreateButton
            text="Новый сотрудник"
            icon={IdentificationIcon}
            onClick={() => navigate("/app/staffs/create")}
          />
        )}

        {isClientsPage && (
          <CreateButton
            text="Новый клиент"
            icon={UserPlusIcon}
            onClick={() => navigate("/app/clients/create")}
          />
        )}

        <button
          onClick={openBar}
          className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
        >
          <CubeIcon className="h-5 w-5" />
        </button>

        <BellIcon className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition" />

        <div className="flex items-center gap-3 cursor-pointer group">
          <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition">
            Owner
          </span>
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="h-9 w-9 rounded-full border border-white/10 group-hover:border-emerald-500 transition"
          />
        </div>

      </div>
    </div>
  )
}

/* BACK HEADER */
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

/* CREATE BUTTON */
function CreateButton({ text, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        hidden sm:flex items-center gap-2
        rounded-xl
        bg-gradient-to-r from-emerald-600 to-emerald-500
        px-5 py-2.5
        text-sm font-semibold text-white
        shadow-lg shadow-emerald-600/20
        hover:scale-105
        hover:shadow-emerald-500/40
        active:scale-95
        transition-all duration-300
      "
    >
      <Icon className="h-5 w-5" />
      {text}
    </button>
  )
}