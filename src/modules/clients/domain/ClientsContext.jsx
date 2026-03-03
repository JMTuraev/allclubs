import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore"

import { db } from "../../../firebase"

const ClientsContext = createContext(null)

export function ClientsProvider({ children }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  // vaqtincha hardcode (keyin authdan olinadi)
  const gymId = "sportzal_demo"

  /* ================= REALTIME LISTENER ================= */

  useEffect(() => {
    if (!gymId) return

    const q = query(
      collection(db, `gyms/${gymId}/clients`),
      where("isArchived", "==", false),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setClients(list)
        setLoading(false)
      },
      (error) => {
        console.error("Clients listener error:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [gymId])

  /* ================= SELECTORS ================= */

  const getClientById = (id) =>
    clients.find((c) => String(c.id) === String(id))

  const getActiveClients = () => clients

  /* ================= RETURN ================= */

  const value = useMemo(
    () => ({
      clients,
      loading,
      getClientById,
      getActiveClients,
    }),
    [clients, loading]
  )

  return (
    <ClientsContext.Provider value={value}>
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