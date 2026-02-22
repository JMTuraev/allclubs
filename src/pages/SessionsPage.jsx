import Filter from "../components/sessions/Filter"
import Table from "../components/sessions/Table"
import InfoCards from "../components/sessions/InfoCards"

export default function SessionsPage() {
  const sessions = [
    {
      id: "S1",
      client: "Ali Karimov",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      staff: "Bekzod",
      status: "active",
      bar: [{ name: "Water", price: 5000 }],
      package: [{ name: "Monthly Gold", price: 80000 }],
      trainer: [{ name: "Trainer 30m", price: 30000 }],
    },
    {
      id: "S2",
      client: "Lola Axmedova",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      staff: "Jamshid",
      status: "ended",
      bar: [{ name: "Protein", price: 12000 }],
      package: [],
      trainer: [],
    },
  ]

  return (
    <div className="px-6 lg:px-8 space-y-8">

     

      {/* INFO CARDS */}
      <InfoCards sessions={sessions} />

      {/* TABLE */}
      <Table sessions={sessions} />
    </div>
  )
}