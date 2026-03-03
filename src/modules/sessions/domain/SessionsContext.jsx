import { createContext, useContext, useEffect, useState } from "react"
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore"

import { db } from "../../../firebase"

const SessionsContext = createContext(null)

export function SessionsProvider({ children }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const gymId = "sportzal_demo" // keyin authdan olinadi

  /* ================= REALTIME LISTENER ================= */

  useEffect(() => {
    const q = query(
      collection(db, `gyms/${gymId}/sessions`),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))

        setSessions(list)
        setLoading(false)
      },
      (error) => {
        console.error("Sessions listener error:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [gymId])

  const value = {
    sessions,
    loading
  }

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  )
}

export function useSessionsContext() {
  const ctx = useContext(SessionsContext)

  if (!ctx) {
    throw new Error("useSessionsContext must be used inside SessionsProvider")
  }

  return ctx
}