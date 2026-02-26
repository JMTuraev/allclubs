import { createContext, useContext, useState } from "react"

const PackagesContext = createContext()

export function PackagesProvider({ children }) {
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "1 месяц",
      duration: 30,
      bonusDays: 0,
      price: 300000,

      // NEW MODEL
      isUnlimited: true,
      visitLimit: null, // null = unlimited

      startTime: null,
      endTime: null,
      freezeEnabled: false,
      maxFreezeDays: 0,
      gender: "all",
      description: "Полный доступ ко всем тренировкам клуба.",
      gradient: "from-indigo-500 to-indigo-700",
    },
  ])

  const addPackage = (pkg) => {
    setPackages((prev) => [
      ...prev,
      { ...pkg, id: Date.now() },
    ])
  }

  const updatePackage = (id, updates) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      )
    )
  }

  const deletePackage = (id) => {
    setPackages((prev) =>
      prev.filter((p) => p.id !== id)
    )
  }

  return (
    <PackagesContext.Provider
      value={{
        packages,
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
  return useContext(PackagesContext)
}