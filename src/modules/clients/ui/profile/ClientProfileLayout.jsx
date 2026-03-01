export default function ClientProfileLayout({
  header,
  left,
  right,
}) {
  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">

        {header}

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 flex flex-col gap-4">
            {left}
          </div>

          <div className="col-span-4 flex flex-col gap-4">
            {right}
          </div>
        </div>

      </div>
    </div>
  )
}