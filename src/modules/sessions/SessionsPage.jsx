import InfoCards from "./ui/InfoCards"
import SessionsTable from "./ui/SessionsTable"
import { useSessions } from "./domain/useSessions"

export default function SessionsPage() {
  const { sessions } = useSessions()

  return (
    <div className="px-6 lg:px-8 space-y-8">
      <InfoCards />
      <SessionsTable sessions={sessions} />
    </div>
  )
}