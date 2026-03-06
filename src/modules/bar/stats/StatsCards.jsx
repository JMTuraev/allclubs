export default function StatsCards({
  revenue,
  cost,
  profit,
  checks
}) {

  const cards = [

    {
      title: "Revenue",
      value: revenue,
      color: "from-emerald-500/20 to-transparent"
    },

    {
      title: "Cost",
      value: cost,
      color: "from-orange-500/20 to-transparent"
    },

    {
      title: "Profit",
      value: profit,
      color: "from-indigo-500/20 to-transparent"
    },

    {
      title: "Checks",
      value: checks,
      color: "from-white/10 to-transparent",
      isNumber: true
    }

  ];

  return (

    <div className="grid grid-cols-4 gap-4">

      {cards.map(card => (

        <div
          key={card.title}
          className={`p-5 rounded-2xl bg-gradient-to-r ${card.color} border border-white/10`}
        >

          <div className="text-sm text-gray-400">
            {card.title}
          </div>

          <div className="text-2xl font-semibold mt-1">

            {card.isNumber
              ? card.value
              : card.value.toLocaleString() + " so'm"
            }

          </div>

        </div>

      ))}

    </div>

  );

}