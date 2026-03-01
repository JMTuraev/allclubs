import { createContext, useContext, useState } from "react"

const PackagesContext = createContext(null)

export function PackagesProvider({ children }) {
  const [packages, setPackages] = useState([
  {
  id: 2,
  name: "10 посещений",
  duration: 30,
  bonusDays: 0,
  price: 500000,

  isUnlimited: false,
  visitLimit: 10,

  startTime: null,
  endTime: null,
  freezeEnabled: false,
  maxFreezeDays: 0,
  gender: "all",

  description: "Абонемент на 10 посещений в течение 30 дней.",
  gradient: "from-emerald-500 to-emerald-700",

  isArchived: false,
  createdAt: new Date().toISOString(),
},
{
  id: 3,
  name: "3 месяца",
  duration: 90,
  bonusDays: 5,
  price: 800000,

  isUnlimited: true,
  visitLimit: null,

  startTime: null,
  endTime: null,
  freezeEnabled: true,
  maxFreezeDays: 14,
  gender: "all",

  description: "Безлимитный доступ на 3 месяца + 5 бонусных дней.",
  gradient: "from-purple-500 to-purple-700",

  isArchived: false,
  createdAt: new Date().toISOString(),
},
{
  id: 4,
  name: "Женский фитнес (день)",
  duration: 30,
  bonusDays: 0,
  price: 350000,

  isUnlimited: true,
  visitLimit: null,

  startTime: "08:00",
  endTime: "16:00",
  freezeEnabled: false,
  maxFreezeDays: 0,
  gender: "female",

  description: "Дневной абонемент для женщин (08:00–16:00).",
  gradient: "from-pink-500 to-rose-600",

  isArchived: false,
  createdAt: new Date().toISOString(),
},
{
  id: 5,
  name: "Утренний (будни)",
  duration: 30,
  bonusDays: 0,
  price: 250000,

  isUnlimited: false,
  visitLimit: 20,

  startTime: "07:00",
  endTime: "12:00",
  freezeEnabled: true,
  maxFreezeDays: 7,
  gender: "all",

  description: "Абонемент на будние дни утром (07:00–12:00).",
  gradient: "from-orange-500 to-amber-600",

  isArchived: false,
  createdAt: new Date().toISOString(),
}
  ])

  /* ================= ADD ================= */

  const addPackage = (pkg) => {
    setPackages(prev => [
      ...prev,
      {
        ...pkg,
        id: Date.now(),
        isArchived: false,
        createdAt: new Date().toISOString(),
      },
    ])
  }

  /* ================= UPDATE ================= */

  const updatePackage = (id, updates) => {
    setPackages(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...updates }
          : p
      )
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
        packages: activePackages, // 🔥 UI faqat aktivlarni ko‘radi
        allPackages: packages,    // 🔥 agar tarix kerak bo‘lsa
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