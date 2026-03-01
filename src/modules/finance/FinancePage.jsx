import { useTransactions } from "../../context/transaction/TransactionContext"
import { useClientsContext } from "../../modules/clients/domain/ClientsContext"
import { useEffect } from "react"

import { useFinanceFilters } from "./domain/useFinanceFilters"
import { useClientBalances } from "./domain/useClientBalances"

import FinanceTabs from "./ui/FinanceTabs"
import ClientBalancesCard from "./ui/ClientBalancesCard"
import TransactionsTable from "./ui/TransactionsTable"

export default function FinancePage() {

  // 🔥 MUHIM: activeTransactions ni olamiz
  const { activeTransactions } = useTransactions()
  const { clients } = useClientsContext()

  useEffect(() => {
  console.log("TX:", activeTransactions)
}, [activeTransactions])
  const {
    activeTab,
    clientParam,
    finalTransactions,
    dateFilteredTransactions,
    changeTab,
    setClientFilter,
    clearClientFilter
  } = useFinanceFilters(activeTransactions)

  const balances = useClientBalances(
    dateFilteredTransactions,
    clients
  )

  const filteredClient = clients.find(
    (c) => String(c.id) === String(clientParam)
  )

  return (
    <div className="space-y-8">

      <FinanceTabs
        activeTab={activeTab}
        onChange={changeTab}
      />

      {activeTab === "overview" && (
        <ClientBalancesCard
          balances={balances}
          onClientClick={setClientFilter}
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsTable
          transactions={finalTransactions}
          clients={clients}
          clientParam={clientParam}
          filteredClient={filteredClient}
          onClearClient={clearClientFilter}
        />
      )}

    </div>
  )
}