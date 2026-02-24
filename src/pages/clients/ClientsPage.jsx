import { useClients } from "../../modules/clients/domain/useClients"
import ClientsTable from "../../modules/clients/ui/ClientsTable"

export default function ClientsPage() {
  const { clients } = useClients()

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <ClientsTable clients={clients} />
    </div>
  )
}