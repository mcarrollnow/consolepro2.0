"use client";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function SalesTrendChart({ salesTrend }: { salesTrend: any[] }) {
  console.log("SalesTrendChart data:", salesTrend);
  if (!Array.isArray(salesTrend) || salesTrend.length === 0) {
    return <div className="text-slate-400 border-4 border-cyan-500 bg-slate-900 z-50 p-8 text-center">No sales trend data available.</div>;
  }
  return (
    <div style={{ border: '4px solid #06b6d4', background: '#0f172a', zIndex: 1000, position: 'relative', padding: 16 }}>
      <ChartContainer data={salesTrend} config={{}}>
        <LineChart data={salesTrend} width={600} height={250}>
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#06b6d4" // cyan-500
            strokeWidth={3}
            dot={{ r: 4, fill: "#0ea5e9", stroke: "#fff", strokeWidth: 2 }} // cyan-600 dot with white border
            activeDot={{ r: 6, fill: "#0ea5e9", stroke: "#fff", strokeWidth: 2 }}
          />
          <XAxis
            dataKey="date"
            stroke="#94a3b8" // slate-400
            tick={{ fill: "#cbd5e1" }} // slate-200
            axisLine={{ stroke: "#334155" }} // slate-700
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1" }}
            axisLine={{ stroke: "#334155" }}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a", // slate-900
              border: "1px solid #334155", // slate-700
              color: "#e0f2fe", // cyan-100
            }}
            itemStyle={{ color: "#06b6d4" }}
            labelStyle={{ color: "#cbd5e1" }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
} 