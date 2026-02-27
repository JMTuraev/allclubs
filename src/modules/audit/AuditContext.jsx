import { createContext, useContext, useState } from "react"

const AuditContext = createContext(null)

export function AuditProvider({ children }) {
  const [events, setEvents] = useState([])

  const addEvent = (event) => {
    setEvents(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...event
      }
    ])
  }

  return (
    <AuditContext.Provider value={{ events, addEvent }}>
      {children}
    </AuditContext.Provider>
  )
}

export function useAudit() {
  const ctx = useContext(AuditContext)
  if (!ctx) {
    throw new Error("useAudit must be used inside AuditProvider")
  }
  return ctx
}