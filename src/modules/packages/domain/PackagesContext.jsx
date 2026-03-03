import { createContext, useContext, useEffect, useState } from "react"
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"

import { db } from "../../../firebase"

const PackagesContext = createContext(null)

export function PackagesProvider({ children }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  const gymId = "sportzal_demo" // keyin authdan olamiz

  /* ================= REALTIME LISTENER ================= */

  useEffect(() => {
    const q = query(
      collection(db, "gyms", gymId, "packages"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id, // 🔥 AUTO ID
            ...docSnap.data(),
          }))
          .filter((p) => !p.isArchived) // 🔥 archive filter JS ichida

        setPackages(list)
        setLoading(false)
      },
      (error) => {
        console.error("Packages listener error:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [gymId])

  /* ================= ADD (AUTO ID) ================= */

  const addPackage = async (pkg) => {
    const duration = Number(pkg.duration)
    const bonusDays = Number(pkg.bonusDays || 0)
    const price = Number(pkg.price)

    if (!duration || duration <= 0) {
      throw new Error("Duration must be greater than 0")
    }

    if (!price || price <= 0) {
      throw new Error("Price must be greater than 0")
    }

    const visitLimit = duration + bonusDays

    await addDoc(collection(db, "gyms", gymId, "packages"), {
      name: pkg.name || "",
      duration,
      bonusDays,
      price,
      visitLimit,
      type: "fixed",
      isUnlimited: false,
      startTime: pkg.startTime || null,
      endTime: pkg.endTime || null,
      freezeEnabled: !!pkg.freezeEnabled,
      maxFreezeDays: pkg.freezeEnabled
        ? Number(pkg.maxFreezeDays || 0)
        : 0,
      gender: pkg.gender || "all",
      gradient: pkg.gradient || "from-indigo-500 to-indigo-700",
      description: pkg.description || "",
      isArchived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  /* ================= UPDATE ================= */

  const updatePackage = async (id, updates) => {
    const ref = doc(db, "gyms", gymId, "packages", id)

    const duration = Number(updates.duration)
    const bonusDays = Number(updates.bonusDays || 0)
    const price = Number(updates.price)

    if (!duration || duration <= 0) {
      throw new Error("Duration must be greater than 0")
    }

    if (!price || price <= 0) {
      throw new Error("Price must be greater than 0")
    }

    const visitLimit = duration + bonusDays

    await updateDoc(ref, {
      name: updates.name || "",
      duration,
      bonusDays,
      price,
      visitLimit,
      isUnlimited: false,
      startTime: updates.startTime || null,
      endTime: updates.endTime || null,
      freezeEnabled: !!updates.freezeEnabled,
      maxFreezeDays: updates.freezeEnabled
        ? Number(updates.maxFreezeDays || 0)
        : 0,
      gender: updates.gender || "all",
      gradient: updates.gradient || "from-indigo-500 to-indigo-700",
      description: updates.description || "",
      updatedAt: serverTimestamp(),
    })
  }

  /* ================= SOFT DELETE ================= */

  const deletePackage = async (id) => {
    const ref = doc(db, "gyms", gymId, "packages", id)

    await updateDoc(ref, {
      isArchived: true,
      updatedAt: serverTimestamp(),
    })
  }

  return (
    <PackagesContext.Provider
      value={{
        packages,
        loading,
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
    throw new Error("usePackages must be used inside PackagesProvider")
  }

  return context
}