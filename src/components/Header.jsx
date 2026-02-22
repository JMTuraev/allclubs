import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline"
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/20/solid"
import { useLocation, useNavigate } from "react-router-dom"
import Filter from "../components/sessions/Filter"

export default function Header({ setSidebarOpen }) {
  const location = useLocation()
  const navigate = useNavigate()

  /* ===== ROUTES ===== */
  const isSessionsPage = location.pathname === "/app/sessions"

  const isPackagesPage = location.pathname === "/app/packages"
  const isCreatePackagePage =
    location.pathname === "/app/packages/create"

  const isStaffPage = location.pathname === "/app/staffs"
  const isCreateStaffPage =
    location.pathname === "/app/staffs/create"

  const isClientsPage = location.pathname === "/app/clients"
  const isCreateClientPage =
    location.pathname === "/app/clients/create"

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center border-b border-white/10 bg-gray-900 px-6">

      {/* ================= LEFT SIDE ================= */}
      <div className="flex items-center gap-4">

        {/* Mobile sidebar */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-white hover:text-gray-300 transition"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* ===== SESSIONS TITLE ===== */}
        {isSessionsPage && (
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-white">
              Sessions
            </h1>
         
          </div>
        )}

        {/* ===== CREATE PACKAGE BACK ===== */}
        {isCreatePackagePage && (
          <HeaderBack
            title="Создать тариф"
            navigate={navigate}
          />
        )}

        {/* ===== CREATE STAFF BACK ===== */}
        {isCreateStaffPage && (
          <HeaderBack
            title="Новый сотрудник"
            navigate={navigate}
          />
        )}

        {/* ===== CREATE CLIENT BACK ===== */}
        {isCreateClientPage && (
          <HeaderBack
            title="Новый клиент"
            navigate={navigate}
          />
        )}
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="ml-auto flex items-center gap-6">

        {/* ===== SESSIONS FILTER ===== */}
        {isSessionsPage && (
          <Filter onChange={() => {}} />
        )}

        {/* ===== CREATE PACKAGE ===== */}
        {isPackagesPage && (
          <CreateButton
            text="Создать тариф"
            color="indigo"
            onClick={() =>
              navigate("/app/packages/create")
            }
          />
        )}

        {/* ===== CREATE STAFF ===== */}
        {isStaffPage && (
          <CreateButton
            text="Новый сотрудник"
            color="emerald"
            onClick={() =>
              navigate("/app/staffs/create")
            }
          />
        )}

        {/* ===== CREATE CLIENT ===== */}
        {isClientsPage && (
          <CreateButton
            text="Новый клиент"
            color="violet"
            onClick={() =>
              navigate("/app/clients/create")
            }
          />
        )}

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
    <>
      {/* Desktop */}
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

      {/* Mobile */}
      <button
        onClick={onClick}
        className={`
          sm:hidden
          rounded-full
          bg-${color}-600
          p-2
          text-white
          shadow-md
          active:scale-95
          transition
        `}
      >
        <PlusIcon className="h-5 w-5" />
      </button>
    </>
  )
}