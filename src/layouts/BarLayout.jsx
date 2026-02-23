import { Outlet, NavLink } from "react-router-dom";

export default function BarLayout() {
  return (
    <div className="h-dvh flex flex-col bg-[#0B1120] text-white">

      {/* HEADER */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">
        <div className="flex gap-8 text-sm">
          <NavLink to="/bar/incoming">Incoming</NavLink>
          <NavLink to="/bar/new">Products</NavLink>
          <NavLink to="/bar/statistics">Statistics</NavLink>
        </div>

        <NavLink
          to="/bar/pos"
          className="bg-indigo-600 px-4 py-2 rounded-md text-sm"
        >
          ⚡ POS Menu
        </NavLink>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

    </div>
  );
}