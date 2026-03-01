import { createContext, useContext, useState } from "react"

const ClientsContext = createContext(null)

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
      type: "member",
      lifetimeSpent: 1250000,
      createdAt: "2026-02-01",
    },
    {
      id: 125,
      firstName: "Jafarali",
      lastName: "Turaev",
      phone: "+998 91 555 44 33",
      gender: "male",
      age: 29,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&q=80",
      type: "member",
      lifetimeSpent: 980000,
      createdAt: "2026-01-10",
    },
    {
      id: 126,
      firstName: "Dilnoza",
      lastName: "Karimova",
      phone: "+998 93 777 22 11",
      gender: "female",
      age: 24,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&q=80",
      type: "member",
      lifetimeSpent: 450000,
      createdAt: "2026-02-15",
    },
    {
      id: 127,
      firstName: "Azizbek",
      lastName: "Rasulov",
      phone: "+998 99 333 88 66",
      gender: "male",
      age: 31,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80",
      type: "member",
      lifetimeSpent: 2100000,
      createdAt: "2025-12-01",
    },
    {
      id: 128,
      firstName: "Madina",
      lastName: "Ismoilova",
      phone: "+998 97 222 11 00",
      gender: "female",
      age: 26,
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=256&q=80",
      type: "member",
      lifetimeSpent: 600000,
      createdAt: "2026-02-20",
    },
  ])

  /* ================= QUERIES ================= */

  const getClientById = (id) =>
    clients.find((c) => String(c.id) === String(id))

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
        createdAt: new Date().toISOString(),
      },
    ])

  const updateClient = (id, updates) =>
    setClients((prev) =>
      prev.map((c) =>
        String(c.id) === String(id)
          ? { ...c, ...updates }
          : c
      )
    )

  return (
    <ClientsContext.Provider
      value={{
        clients,
        getClientById,
        getActiveClients,
        addClient,
        updateClient,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}

export function useClientsContext() {
  const context = useContext(ClientsContext)

  if (!context) {
    throw new Error(
      "useClientsContext must be used inside ClientsProvider"
    )
  }

  return context
}