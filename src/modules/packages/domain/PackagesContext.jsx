import { createContext, useContext, useState } from "react"

const PackagesContext = createContext(null)

export function PackagesProvider({ children }) {

  const calculateVisitLimit = (duration, bonusDays) => {
    return Number(duration || 0) + Number(bonusDays || 0)
  }

const [packages, setPackages] = useState([
  {
    id: 101,
    name: "1 месяц стандарт",
    duration: 30,
    bonusDays: 0,
    price: 450000,

    visitLimit: 30, // 🔒 30 + 0

    startTime: null,
    endTime: null,
    freezeEnabled: false,
    maxFreezeDays: 0,
    gender: "all",

    description: "Стандартный абонемент на 30 дней.",
    gradient: "from-indigo-500 to-indigo-700",

    isArchived: false,
    createdAt: new Date().toISOString(),
  },

  {
    id: 102,
    name: "3 месяца + бонус",
    duration: 90,
    bonusDays: 5,
    price: 1200000,

    visitLimit: 95, // 🔒 90 + 5

    startTime: null,
    endTime: null,
    freezeEnabled: true,
    maxFreezeDays: 14,
    gender: "all",

    description: "Абонемент на 3 месяца + 5 бонусных дней.",
    gradient: "from-purple-500 to-purple-700",

    isArchived: false,
    createdAt: new Date().toISOString(),
  },

  {
    id: 103,
    name: "Утренний (07:00–12:00)",
    duration: 30,
    bonusDays: 0,
    price: 300000,

    visitLimit: 30, // 🔒 30 + 0

    startTime: "07:00",
    endTime: "12:00",
    freezeEnabled: false,
    maxFreezeDays: 0,
    gender: "all",

    description: "Доступ только утром (07:00–12:00).",
    gradient: "from-amber-500 to-orange-600",

    isArchived: false,
    createdAt: new Date().toISOString(),
  },

  {
    id: 104,
    name: "Женский фитнес",
    duration: 30,
    bonusDays: 2,
    price: 380000,

    visitLimit: 32, // 🔒 30 + 2

    startTime: "08:00",
    endTime: "16:00",
    freezeEnabled: true,
    maxFreezeDays: 7,
    gender: "female",

    description: "Дневной абонемент для женщин (08:00–16:00).",
    gradient: "from-pink-500 to-rose-600",

    isArchived: false,
    createdAt: new Date().toISOString(),
  },
])

  /* ================= ADD ================= */

  const addPackage = (pkg) => {

    const duration = Number(pkg.duration)
    const bonusDays = Number(pkg.bonusDays)
    const price = Number(pkg.price)

    if (duration <= 0 || price <= 0) return

    const visitLimit = calculateVisitLimit(duration, bonusDays)

    setPackages(prev => [
      ...prev,
      {
        ...pkg,
        duration,
        bonusDays,
        price,
        visitLimit,     // 🔒 always auto
        isUnlimited: false, // 🔒 forced

        id: Date.now(),
        isArchived: false,
        createdAt: new Date().toISOString(),
      },
    ])
  }

  /* ================= UPDATE ================= */

  const updatePackage = (id, updates) => {

    setPackages(prev =>
      prev.map(p => {
        if (p.id !== id) return p

        const duration = Number(
          updates.duration ?? p.duration
        )

        const bonusDays = Number(
          updates.bonusDays ?? p.bonusDays
        )

        const price = Number(
          updates.price ?? p.price
        )

        if (duration <= 0 || price <= 0) {
          return p
        }

        const visitLimit = calculateVisitLimit(
          duration,
          bonusDays
        )

        return {
          ...p,
          ...updates,
          duration,
          bonusDays,
          price,
          visitLimit,
          isUnlimited: false, // 🔒 forced
        }
      })
    )
  }

  /* ================= SOFT DELETE ================= */

  const deletePackage = (id) => {
    setPackages(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, isArchived: true }
          : p
      )
    )
  }

  /* ================= GETTERS ================= */

  const activePackages = packages.filter(
    p => !p.isArchived
  )

  return (
    <PackagesContext.Provider
      value={{
        packages: activePackages,
        allPackages: packages,
        addPackage,
        updatePackage,
        deletePackage,
      }}
    >
      {children}
    </PackagesContext.Provider>
  )
}

export function usePackages() {
  const context = useContext(PackagesContext)

  if (!context) {
    throw new Error(
      "usePackages must be used inside PackagesProvider"
    )
  }

  return context
}