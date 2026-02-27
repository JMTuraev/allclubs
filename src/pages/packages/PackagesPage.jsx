import { useSearchParams } from "react-router-dom"
import { usePackages } from "../../modules/packages/domain/PackagesContext"

import PackageGrid from "../../modules/packages/ui/PackageGrid"
import DeletePackageModal from "../../modules/packages/ui/DeletePackageModal"
import EditPackageDrawer from "../../modules/packages/ui/EditPackageDrawer"
import SoldPackagesList from "../../modules/subscriptions/ui/SoldPackagesList"
import Toast from "../../components/ui/Toast"

import { useState } from "react"

export default function PackagesPage() {
  const { packages, updatePackage, deletePackage } = usePackages()
  const [searchParams] = useSearchParams()

  const activeTab = searchParams.get("tab") || "templates"

  const [confirmId, setConfirmId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [showToast, setShowToast] = useState(false)

  const handleDelete = () => {
    deletePackage(confirmId)
    setConfirmId(null)
  }

  const handleUpdate = (data) => {
    updatePackage(data.id, data)
    setShowToast(true)
  }

  return (
    <div className="space-y-4">

      {/* Templates */}
      {activeTab === "templates" && (
        <PackageGrid
          packages={packages}
          onEdit={setEditing}
          onDelete={setConfirmId}
        />
      )}

      {/* Sold */}
      {activeTab === "sold" && (
        <SoldPackagesList />
      )}

      {/* Delete Modal */}
      {confirmId && (
        <DeletePackageModal
          onCancel={() => setConfirmId(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* Edit Drawer */}
      {editing && (
        <EditPackageDrawer
          pkg={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
        />
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          message="Package updated successfully"
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

    </div>
  )
}