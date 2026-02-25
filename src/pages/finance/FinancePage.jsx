import { useMemo } from "react"
import {
  useOutletContext,
  useSearchParams
} from "react-router-dom"

import { useTransactions } from "../../context/transaction/TransactionContext"
import { useClientsContext } from "../../modules/clients/domain/ClientsContext"
import { XMarkIcon } from "@heroicons/react/24/solid"

export default function FinancePage() {
  const { transactions } = useTransactions()
  const { clients } = useClientsContext()

  const [searchParams, setSearchParams] = useSearchParams()

  const urlDate = searchParams.get("date")
  const clientParam = searchParams.get("client")
  const activeTab = searchParams.get("tab") || "overview"

  /* ================= DATE FILTER ================= */

  const dateFilteredTransactions = useMemo(() => {
    let result = [...transactions]

    if (urlDate) {
      const selected = new Date(urlDate)

      const start = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      )

      const end = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate() + 1
      )

      result = result.filter(
        (t) =>
          new Date(t.createdAt) >= start &&
          new Date(t.createdAt) < end
      )
    }

    return result
  }, [transactions, urlDate])

  /* ================= CLIENT FILTER ================= */

  const finalTransactions = useMemo(() => {
    if (!clientParam) return dateFilteredTransactions

    return dateFilteredTransactions.filter(
      (t) =>
        String(t.clientId) === String(clientParam)
    )
  }, [dateFilteredTransactions, clientParam])

  /* ================= CLIENT BALANCES ================= */

  const clientBalances = useMemo(() => {
    const map = {}

    dateFilteredTransactions.forEach((t) => {
      if (!t.clientId) return

      const id = String(t.clientId)

      if (!map[id]) {
        map[id] = { services: 0, payments: 0 }
      }

      if (t.type === "service") map[id].services += t.amount
      if (t.type === "payment") map[id].payments += t.amount
    })

    return Object.entries(map).map(([clientId, data]) => {
      const client = clients.find(
        (c) => String(c.id) === String(clientId)
      )

      return {
        clientId,
        client,
        services: data.services,
        payments: data.payments,
        balance: data.services - data.payments
      }
    })
  }, [dateFilteredTransactions, clients])

  /* ================= HANDLERS ================= */

  const changeTab = (tab) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", tab)
    setSearchParams(params)
  }

  const handleClientClick = (clientId) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", "transactions")
    params.set("client", clientId)
    setSearchParams(params)
  }

  const clearClientFilter = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("client")
    setSearchParams(params)
  }

  const filteredClient = clients.find(
    (c) => String(c.id) === String(clientParam)
  )

  /* ================= RENDER ================= */

  return (
    <div className="space-y-8">

      {/* ===== TABS ===== */}
      <div className="flex gap-8 border-b border-white/10">
        <TabButton
          active={activeTab === "overview"}
          onClick={() => changeTab("overview")}
        >
          Overview
        </TabButton>

        <TabButton
          active={activeTab === "transactions"}
          onClick={() => changeTab("transactions")}
        >
          Transactions
        </TabButton>
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTab === "overview" && (
        <Card title="Client Balances">
          {clientBalances.length === 0 ? (
            <div className="text-gray-500 p-6 text-center">
              No client activity
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-right">Services</th>
                  <th className="p-3 text-right">Payments</th>
                  <th className="p-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {clientBalances.map((c) => (
                  <tr
                    key={c.clientId}
                    className="border-t border-white/5"
                  >
                    <td className="p-3">
                      {c.client ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={c.client.image}
                            className="h-10 w-10 rounded-full object-cover"
                            alt=""
                          />

                          <div>
                            <button
                              onClick={() =>
                                handleClientClick(c.clientId)
                              }
                              className="text-indigo-400 hover:underline font-semibold"
                            >
                              {c.client.firstName} {c.client.lastName}
                            </button>

                            <div className="text-xs text-gray-400">
                              ID: {c.client.id}
                            </div>

                            <div className="text-xs text-gray-500">
                              {c.client.phone}
                            </div>
                          </div>
                        </div>
                      ) : (
                        "Unknown"
                      )}
                    </td>

                    <td className="p-3 text-right text-red-400">
                      {c.services.toLocaleString()} сум
                    </td>

                    <td className="p-3 text-right text-emerald-400">
                      {c.payments.toLocaleString()} сум
                    </td>

                    <td className="p-3 text-right font-semibold text-white">
                      {c.balance.toLocaleString()} сум
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {/* ================= TRANSACTIONS ================= */}
      {activeTab === "transactions" && (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                Transactions
              </h2>

              {clientParam && filteredClient && (
                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
                  <span>
                    {filteredClient.firstName} {filteredClient.lastName}
                  </span>

                  <button
                    onClick={clearClientFilter}
                    className="hover:text-white transition"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className="p-6">
            {finalTransactions.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No transactions found
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-gray-400">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Client</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {finalTransactions.map((t, i) => {
                    const client = clients.find(
                      (c) =>
                        String(c.id) === String(t.clientId)
                    )

                    return (
                      <tr
                        key={`${t.id}-${i}`}
                        className="border-t border-white/5"
                      >
                        <td className="p-3">
                          {new Date(
                            t.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="p-3">
                          {client
                            ? `${client.firstName} ${client.lastName}`
                            : "Unknown"}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              t.type === "payment"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {t.type}
                          </span>
                        </td>

                        <td className="p-3 text-right font-semibold text-white">
                          {t.amount.toLocaleString()} сум
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}

    </div>
  )
}

/* UI COMPONENTS */

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-semibold transition ${
        active
          ? "text-indigo-400 border-b-2 border-indigo-500"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}