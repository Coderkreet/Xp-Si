import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Star,
  Activity,
  Lock,
  Gift,
  Flame,
  Rocket,
  Target,
  Megaphone,
} from "lucide-react";

const COLORS = [
  "#00BCD4", "#2196F3", "#4CAF50", "#FF9800", "#FF5722",
  "#9C27B0", "#3F51B5", "#795548", "#607D8B", "#E91E63"
];

const tokenomicsData = [
  {
    category: "Total Supply",
    allocation: "100M Zcoin Supply",
    details: "Fixed supply on BNB Chain",
    icon: <Target className="w-5 h-5" />,
  },
  {
    category: "Locked Supply",
    allocation: "30% (30M ZCOIN)",
    details: "Released over 5 years",
    icon: <Lock className="w-5 h-5" />,
    value: 30,
  },
  {
    category: "Team",
    allocation: "3% (3M ZCOIN)",
    details: "Core team allocation",
    icon: <Users className="w-5 h-5" />,
    value: 3,
  },
  {
    category: "Advisors",
    allocation: "2% (2M ZCOIN)",
    details: "Advisory board allocation",
    icon: <Star className="w-5 h-5" />,
    value: 2,
  },
  {
    category: "Z COIN Ecosystem",
    allocation: "5% (5M ZCOIN)",
    details: "Supports ecosystem projects",
    icon: <Activity className="w-5 h-5" />,
    value: 5,
  },
  {
    category: "Burning Mechanism",
    allocation: "20% (20M Z COIN)",
    details: "Periodic burns to reduce supply",
    icon: <Flame className="w-5 h-5" />,
    value: 20,
  },
  {
    category: "Airdrop & Referral",
    allocation: "3% (3M ZCOIN)",
    details: "Community incentives",
    icon: <Gift className="w-5 h-5" />,
    value: 3,
  },
  {
    category: "Community Users",
    allocation: "25% (25M ZCOIN)",
    details: "Staking & Private Sale",
    icon: <Users className="w-5 h-5" />,
    value: 25,
  },
  {
    category: "Reserve & Future Dev.",
    allocation: "7% (7M ZCOIN)",
    details: "Expansion & innovation",
    icon: <Rocket className="w-5 h-5" />,
    value: 7,
  },
  {
    category: "Marketing & Partnerships",
    allocation: "8% (8M ZCOIN)",
    details: "Growth & strategic collaborations",
    icon: <Megaphone className="w-5 h-5" />,
    value: 8,
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 text-white p-4 rounded shadow-lg text-sm border border-cyan-400 max-w-xs">
        <p className="font-semibold text-cyan-300">{data.category}</p>
        <p className="text-cyan-200">{data.allocation}</p>
        <p className="text-gray-300">{data.details}</p>
      </div>
    );
  }
  return null;
};

const TokenomicsTable = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-12 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
          XPFI-Coin Tokenomics
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">
          Complete token distribution and allocation details
        </p>
      </div>

      {/* Layout: Pie + Table */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Pie Chart */}
        <div className="w-full h-[500px] md:h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tokenomicsData.slice(1)}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius="85%"
                label
              >
                {tokenomicsData.slice(1).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "12px", marginTop: "20px" }}
              />

            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Token Table (optional section) */}
        {/* 
        <div className="w-full lg:w-1/2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="px-4 sm:px-6 py-2 text-left text-cyan-400 font-semibold">Category</th>
                  <th className="px-4 sm:px-6 py-2 text-center text-cyan-400 font-semibold">Allocation</th>
                  <th className="px-4 sm:px-6 py-2 text-left text-cyan-400 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {tokenomicsData.slice(1).map((item, index) => (
                  <tr
                    key={index}
                    className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-lg">
                          {item.icon}
                        </div>
                        <span className="text-white text-sm">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="text-cyan-300 text-sm">{item.allocation}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className="text-gray-300 text-sm">{item.details}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default TokenomicsTable;
