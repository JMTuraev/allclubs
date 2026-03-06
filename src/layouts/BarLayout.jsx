'use client'

import { Outlet, NavLink, useLocation, useSearchParams } from "react-router-dom"
import { BarProvider } from "../context/bar/BarContext"
import { Popover } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import Filter from "../components/Filter"

export default function BarLayout() {

  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const isStatisticsPage = location.pathname === "/bar/statistics"

  /* ================= DATE FILTER ================= */

  const handleDateChange = (payload) => {

    const params = new URLSearchParams(searchParams)

    params.delete("date")

    if (!payload || payload.type === "all") {

      params.delete("from")
      params.delete("to")

    } else {

      if (payload.from) {
        params.set(
          "from",
          payload.from.toISOString().slice(0, 10)
        )
      }

      if (payload.to) {
        params.set(
          "to",
          payload.to.toISOString().slice(0, 10)
        )
      }

    }

    setSearchParams(params)

  }

  return (
    <BarProvider>

      <div className="h-dvh flex flex-col bg-[#0B1120] text-white">

        {/* HEADER */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">

          {/* LEFT NAV */}
          <div className="flex items-center gap-8 text-sm font-semibold">

            {/* INCOMING DROPDOWN */}
            <Popover className="relative">

              {({ close }) => (

                <>

                  <Popover.Button className="flex items-center gap-x-1 text-gray-300 hover:text-white transition">

                    Incoming

                    <ChevronDownIcon className="size-4 text-gray-500" />

                  </Popover.Button>

                  <Popover.Panel
                    transition
                    className="absolute left-0 ml-4 mt-3 z-20 w-64
                               overflow-y-auto rounded-2xl
                               bg-[#111827] backdrop-blur-xl
                               shadow-[0_10px_40px_rgba(0,0,0,0.6)]
                               ring-1 ring-white/10
                               transition data-closed:translate-y-1 data-closed:opacity-0
                               data-enter:duration-200 data-enter:ease-out
                               data-leave:duration-150 data-leave:ease-in"
                  >

                    <div className="p-3 space-y-1">

                      <NavLink
                        to="/bar/incoming"
                        onClick={() => close()}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "text-gray-300 hover:bg-white/5"
                          }`
                        }
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10">
                          📦
                        </div>

                        <div>

                          <div className="font-medium">New</div>

                          <div className="text-xs text-gray-400">
                            Add new incoming products
                          </div>

                        </div>

                      </NavLink>

                      <NavLink
                        to="/bar/incoming/history"
                        onClick={() => close()}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "text-gray-300 hover:bg-white/5"
                          }`
                        }
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10">
                          🕘
                        </div>

                        <div>

                          <div className="font-medium">History</div>

                          <div className="text-xs text-gray-400">
                            View previous deliveries
                          </div>

                        </div>

                      </NavLink>

                    </div>

                  </Popover.Panel>

                </>

              )}

            </Popover>

            {/* PRODUCTS */}
            <NavLink
              to="/bar/new"
              className={({ isActive }) =>
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-lg"
                  : "text-gray-400 hover:text-white transition px-3 py-1.5"
              }
            >
              Products
            </NavLink>

            {/* STATISTICS */}
            <NavLink
              to="/bar/statistics"
              className={({ isActive }) =>
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-lg"
                  : "text-gray-400 hover:text-white transition px-3 py-1.5"
              }
            >
              Statistics
            </NavLink>

          </div>

          {/* RIGHT AREA */}
          <div className="flex items-center gap-4">

            {/* FILTER ONLY FOR STATISTICS */}
            {isStatisticsPage && (
              <Filter onChange={handleDateChange} />
            )}

            {/* POS BUTTON */}
            <NavLink
              to="/bar/pos"
              className={({ isActive }) =>
                isActive
                  ? "bg-indigo-700 px-4 py-2 rounded-lg text-sm shadow-lg"
                  : "bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm transition shadow-md"
              }
            >
              ⚡ POS Menu
            </NavLink>

          </div>

        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">

          <Outlet />

        </div>

      </div>

    </BarProvider>
  )

}