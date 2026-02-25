import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState(null)

  return (
    <div className="h-[100dvh] flex bg-gray-900 text-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col lg:pl-56 min-h-0">

        <Header
          setSidebarOpen={setSidebarOpen}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {/* 🔥 SCROLL FAOL QILDIK */}
        <main className="flex-1 min-h-0 overflow-y-auto dark-scroll p-6">
          <Outlet context={{ dateFilter }} />
        </main>

      </div>
    </div>
  )
}