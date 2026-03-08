export default function ActiveClients({
  clients = [],
  selectedClient,
  onSelect
}) {
  return (
    <div className="flex flex-col h-full">

      <div className="p-4 border-b border-white/10 text-sm font-semibold tracking-wide">
        Active Clients
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {clients.map((client) => (
          <div
            key={`${client.id}-${client.locker || "guest"}`}
            onClick={() => onSelect(client)}
            className={`p-3 rounded-xl cursor-pointer transition ${
              selectedClient?.id === client.id
                ? client.id === "guest"
                  ? "bg-yellow-500 text-black"
                  : "bg-indigo-600"
                : "bg-white/5 hover:bg-white/10"
            }`}
          >

            <div className="flex items-center gap-2 text-sm font-medium">
              {client.id !== "guest" && (
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              )}
              {client.name}
            </div>

            {client.id !== "guest" && (
              <div className="text-xs text-gray-400 mt-1">
                Locker {client.locker || "-"}
              </div>
            )}

            {client.id === "guest" && (
              <div className="text-xs mt-1 opacity-80">
                Quick Sale Mode
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}