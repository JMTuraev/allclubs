import { Outlet, NavLink } from "react-router-dom";
import { BarProvider } from "../context/bar/BarContext";

export default function BarLayout() {
  return (
    <BarProvider>
      <div className="h-dvh flex flex-col bg-[#0B1120] text-white">

        {/* HEADER */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">

          <div className="flex gap-8 text-sm">

            <NavLink
              to="/bar/incoming"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400 border-b-2 border-indigo-500 pb-1"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              Incoming
            </NavLink>

            <NavLink
              to="/bar/new"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400 border-b-2 border-indigo-500 pb-1"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/bar/statistics"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-400 border-b-2 border-indigo-500 pb-1"
                  : "text-gray-400 hover:text-white transition"
              }
            >
              Statistics
            </NavLink>

          </div>

          <NavLink
            to="/bar/pos"
            className={({ isActive }) =>
              isActive
                ? "bg-indigo-700 px-4 py-2 rounded-md text-sm"
                : "bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-sm transition"
            }
          >
            ⚡ POS Menu
          </NavLink>

        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>

      </div>
    </BarProvider>
  );
}