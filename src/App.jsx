import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

/* ================= CONTEXTS ================= */
import { ProductProvider } from "./context/ProductContext"
import { ClientsProvider } from "./modules/clients/domain/ClientsContext"
import { SessionsProvider } from "./modules/sessions/domain/SessionsContext"
import { PackagesProvider } from "./modules/packages/domain/PackagesContext"
import { TransactionProvider } from "./context/transaction/TransactionContext"
import { SubscriptionsProvider } from "./modules/subscriptions/domain/SubscriptionsContext" // 🔥 NEW

/* ================= LAYOUTS ================= */
import PublicLayout from "./layouts/PublicLayout"
import AppLayout from "./layouts/AppLayout"
import BarLayout from "./layouts/BarLayout"

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/Home"
import Pricing from "./pages/Pricing"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import CreateClub from "./pages/CreateClub"

/* ================= DASHBOARD ================= */
import Dashboard from "./pages/dashboard/Dashboard"
import PackageList from "./pages/packages/PackageList"
import CreatePackage from "./pages/packages/CreatePackage"
import StaffList from "./pages/StaffList"
import CreateStaff from "./pages/CreateStaff"

/* ================= CLIENTS ================= */
import ClientsPage from "./pages/clients/ClientsPage"
import CreateClient from "./pages/clients/CreateClient"
import ClientProfilePage from "./pages/clients/ClientProfilePage"

/* ================= SESSIONS ================= */
import SessionsPage from "./pages/sessions/SessionsPage"

/* ================= BAR ================= */
import NewProductPage from "./pages/bar/NewProductPage"
import IncomingGoodsPage from "./pages/bar/IncomingGoodsPage"
import IncomingHistoryPage from "./pages/bar/IncomingHistoryPage"
import MenuPage from "./pages/bar/MenuPage"

/* ================= FINANCE ================= */
import FinancePage from "./pages/finance/FinancePage"

export default function App() {
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      )
    }

    setAppHeight()
    window.addEventListener("resize", setAppHeight)

    return () =>
      window.removeEventListener("resize", setAppHeight)
  }, [])

  return (
    <ProductProvider>
      <ClientsProvider>
        <PackagesProvider>
          <SubscriptionsProvider> {/* 🔥 NEW */}
            <SessionsProvider>
              <TransactionProvider>
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

                    {/* ================= PROFILE ================= */}
                    <Route
                      path="/clients/:id"
                      element={<ClientProfilePage />}
                    />

                    {/* ================= DASHBOARD ================= */}
                    <Route path="/app/*" element={<AppLayout />}>
                      <Route
                        index
                        element={<Navigate to="dashboard" replace />}
                      />

                      <Route path="dashboard" element={<Dashboard />} />

                      {/* PACKAGES */}
                      <Route path="packages" element={<PackageList />} />
                      <Route
                        path="packages/create"
                        element={<CreatePackage />}
                      />

                      {/* FINANCE */}
                      <Route path="finance" element={<FinancePage />} />

                      {/* STAFF */}
                      <Route path="staffs" element={<StaffList />} />
                      <Route
                        path="staffs/create"
                        element={<CreateStaff />}
                      />

                      {/* CLIENTS */}
                      <Route path="clients" element={<ClientsPage />} />
                      <Route
                        path="clients/create"
                        element={<CreateClient />}
                      />

                      {/* SESSIONS */}
                      <Route path="sessions" element={<SessionsPage />} />
                    </Route>

                    {/* ================= BAR MODULE ================= */}
                    <Route path="/bar/*" element={<BarLayout />}>
                      <Route
                        index
                        element={<Navigate to="incoming" replace />}
                      />
                      <Route
                        path="incoming"
                        element={<IncomingGoodsPage />}
                      />
                      <Route
                        path="incoming/history"
                        element={<IncomingHistoryPage />}
                      />
                      <Route path="new" element={<NewProductPage />} />
                      <Route path="pos" element={<MenuPage />} />
                    </Route>

                    {/* ================= 404 ================= */}
                    <Route
                      path="*"
                      element={<Navigate to="/" replace />}
                    />

                  </Routes>
                </BrowserRouter>
              </TransactionProvider>
            </SessionsProvider>
          </SubscriptionsProvider> {/* 🔥 NEW */}
        </PackagesProvider>
      </ClientsProvider>
    </ProductProvider>
  )
}