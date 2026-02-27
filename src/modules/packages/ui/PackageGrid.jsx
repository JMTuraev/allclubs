import PackageCard from "./PackageCard"

export default function PackageGrid({
  packages,
  onEdit,
  onDelete,
}) {
  if (!packages || packages.length === 0) {
    return (
      <div className="p-6 text-gray-400">
        No packages created yet
      </div>
    )
  }

  return (
    <div className="px-6 py-6">
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {packages.map(pkg => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  )
}