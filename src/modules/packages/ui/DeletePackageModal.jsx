export default function DeletePackageModal({
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111827] w-[380px] rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="text-lg font-semibold text-white">
          Delete Package?
        </div>

        <div className="text-sm text-gray-400">
          This will archive the package. Active clients will not be affected.
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  )
}