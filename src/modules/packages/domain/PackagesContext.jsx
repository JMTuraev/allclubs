import { createContext, useContext, useState } from "react"

const PackagesContext = createContext(null)

export function PackagesProvider({ children }) {
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "1 месяц",
      duration: 30,
      bonusDays: 0,
      price: 300000,

      isUnlimited: true,
      visitLimit: null,

      startTime: null,
      endTime: null,
      freezeEnabled: false,
      maxFreezeDays: 0,
      gender: "all",

      description: "Полный доступ ко всем тренировкам клуба.",
      gradient: "from-indigo-500 to-indigo-700",

      isArchived: false, // 🔥 PROFESSIONAL SOFT DELETE FLAG
      createdAt: new Date().toISOString(),
    },
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