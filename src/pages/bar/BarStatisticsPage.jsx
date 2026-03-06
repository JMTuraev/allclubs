import { useState } from "react";

import StatsCards from "../../modules/bar/stats/StatsCards";
import RevenueCostChart from "../../modules/bar/stats/RevenueCostChart";

export default function BarStatisticsPage() {

  const [filter, setFilter] = useState("30d");

  return (

    <div className="h-full p-4 space-y-4 bg-[#0B1120] text-white">

      
      {/* STATS CARDS */}

      <StatsCards
        revenue={1450000}
        cost={980000}
        profit={470000}
        checks={42}
      />

      {/* CHART */}

      <RevenueCostChart
        filter={filter}
      />

    </div>

  );

}