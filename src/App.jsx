import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import PublicLayout from "./layouts/PublicLayout"
import AppLayout from "./layouts/AppLayout"

import Home from "./pages/Home"
import Pricing from "./pages/Pricing"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import CreateClub from "./pages/CreateClub"

import Dashboard from "./pages/Dashboard"

import PackageList from "./pages/PackageList"
import CreatePackage from "./pages/CreatePackage"

import StaffList from "./pages/StaffList"
import CreateStaff from "./pages/CreateStaff"

import Clients from "./pages/ClientsPage"
import CreateClient from "./pages/CreateClient"

import ClientProfilePage from "./pages/ClientProfilePage.jsx"
import SessionsPage from "./pages/SessionsPage.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contacts" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="create-club" element={<CreateClub />} />
        </Route>

        {/* OWNER APP */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="packages" element={<PackageList />} />
          <Route path="packages/create" element={<CreatePackage />} />
          <Route path="staffs" element={<StaffList />} />
          <Route path="staffs/create" element={<CreateStaff />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/create" element={<CreateClient />} />
          <Route path="sessions" element={<SessionsPage />} />
        </Route>

        {/* PROFILE */}
        <Route path="/client/:clientId" element={<ClientProfilePage />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}