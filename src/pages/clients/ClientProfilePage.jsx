import { useParams } from "react-router-dom"
import { useClientsContext } from "../../modules/clients/domain/ClientsContext"

import ClientProfileLayout from "../../modules/clients/ui/profile/ClientProfileLayout"
import ClientHeader from "../../modules/clients/ui/profile/ClientHeader"
import ClientSubscriptionCard from "../../modules/clients/ui/profile/ClientSubscriptionCard"
import ClientRevenueChart from "../../modules/clients/ui/profile/ClientRevenueChart"
import ClientCalendar from "../../modules/clients/ui/profile/ClientCaelendar"
import ClientPersonalInfo from "../../modules/clients/ui/profile/ClientPersonalInfo"

export default function ClientProfilePage() {
  const { id } = useParams()

  const { getClientById, getClientSessions } = useClientsContext()

  const client = getClientById(id)
  const sessions = getClientSessions(id)

  if (!client) return null

  return (
    <ClientProfileLayout
      header={<ClientHeader client={client} />}
      left={
        <>
          <ClientSubscriptionCard client={client} />
          <ClientRevenueChart />
        </>
      }
      right={
        <>
          <ClientCalendar sessions={sessions} />
          <ClientPersonalInfo client={client} />
        </>
      }
    />
  )
}