import Filter from "../../components/sessions/Filter";
import Table from "../../components/sessions/Table";
import InfoCards from "../../components/sessions/InfoCards";
import { useSessions } from "../../modules/sessions/domain/useSessions";

export default function SessionsPage() {

  const {
    sessions,
    totalRevenue,
    activeCount,
    endedCount
  } = useSessions();

  return (
    <div className="px-6 lg:px-8 space-y-8">

      {/* INFO CARDS */}
      <InfoCards
        sessions={sessions}
        totalRevenue={totalRevenue}
        activeCount={activeCount}
        endedCount={endedCount}
      />

      {/* TABLE */}
      <Table sessions={sessions} />

    </div>
  );
} 