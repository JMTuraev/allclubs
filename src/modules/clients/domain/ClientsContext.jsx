import { createContext, useContext, useState } from "react"

const ClientsContext = createContext()

export function ClientsProvider({ children }) {
  const [clients, setClients] = useState([
    {
      id: 124,
      firstName: "Lindsay",
      lastName: "Walton",
      phone: "+998 90 123 45 67",
      gender: "female",
      age: 27,
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&q=80",

      type: "member", // lead | member

      lifetimeSpent: 1250000,

      package: {
        id: "pkg_1",
        name: "1 Month",
        durationDays: 30,
        visitsTotal: 30,
        visitsUsed: 3,
        price: 1200000,
        startedAt: "2026-02-01",
        expiresAt: "2026-03-01",
      },

      createdAt: "2026-02-01",
    },
  ])

  /* ================= QUERIES ================= */

  const getClientById = (id) =>
    clients.find((c) => c.id === Number(id))

  const getActiveClients = () => clients

  /* ================= COMMANDS ================= */

  const addClient = (newClient) =>
    setClients((prev) => [
      ...prev,
      {
        ...newClient,
        id: Date.now(),
        type: "lead",
        lifetimeSpent: 0,
        package: null,
        createdAt: new Date().toISOString(),
      },
    ])

  const updateClient = (id, updates) =>
    setClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      )
    )

  const assignPackage = (id, pkgTemplate) => {
    const startedAt = new Date()
    const expiresAt = new Date()
    expiresAt.setDate(
      startedAt.getDate() + pkgTemplate.durationDays
    )

    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              type: "member",
              lifetimeSpent:
                c.lifetimeSpent + pkgTemplate.price,
              package: {
                id: pkgTemplate.id,
                name: pkgTemplate.name,
                durationDays: pkgTemplate.durationDays,
                visitsTotal: pkgTemplate.visits,
                visitsUsed: 0,
                price: pkgTemplate.price,
                startedAt: startedAt.toISOString(),
                expiresAt: expiresAt.toISOString(),
              },
            }
          : c
      )
    )
  }

  return (
    <ClientsContext.Provider
      value={{
        clients,
        getClientById,
        getActiveClients,
        addClient,
        updateClient,
        assignPackage,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}

export function useClientsContext() {
  return useContext(ClientsContext)
}