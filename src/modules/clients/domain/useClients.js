import { useClientsContext } from "./ClientsContext"

export function useClients() {
  const { clients, getClientById } =
    useClientsContext()

  return {
    clients,
    getClientById,
  }
}