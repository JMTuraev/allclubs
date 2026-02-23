import { useEffect } from "react";
import { ProductProvider } from "./context/ProductContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import BarLayout from "./layouts/BarLayout";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import CreateClub from "./pages/CreateClub";

import Dashboard from "./pages/Dashboard";
import PackageList from "./pages/PackageList";
import CreatePackage from "./pages/CreatePackage";
import StaffList from "./pages/StaffList";
import CreateStaff from "./pages/CreateStaff";
import Clients from "./pages/ClientsPage";
import CreateClient from "./pages/CreateClient";
import ClientProfilePage from "./pages/ClientProfilePage";
import SessionsPage from "./pages/SessionsPage";

import BarPage from "./pages/BarPage";
import NewProductPage from "./pages/NewProductPage";
import IncomingGoodsPage from "./pages/IncomingGoodsPage";
import MenuPage from "./pages/MenuPage";

export default function App() {

  // 🔥 GLOBAL DYNAMIC HEIGHT FIX
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);

    return () => window.removeEventListener("resize", setAppHeight);
  }, []);

  return (
    <ProductProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-club" element={<CreateClub />} />
          </Route>

          {/* ================= DASHBOARD ================= */}
          <Route path="/app/*" element={<AppLayout />}>
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

          {/* ================= BAR MODULE ================= */}
          <Route path="/bar/*" element={<BarLayout />}>
            <Route index element={<Navigate to="incoming" replace />} />
            <Route path="incoming" element={<IncomingGoodsPage />} />
            <Route path="new" element={<NewProductPage />} />
            <Route path="pos" element={<MenuPage />} />
          </Route>

          {/* ================= PROFILE ================= */}
          <Route path="/client/:clientId" element={<ClientProfilePage />} />

          {/* ================= 404 ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </ProductProvider>
  );
}