"use client";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Label
} from "recharts";

export default function SalesTrendChart({ salesTrend }: { salesTrend: any[] }) {
  if (!Array.isArray(salesTrend) || salesTrend.length === 0) {
    return <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-8 text-center text-slate-400">No sales trend data available.</div>;
  }
  return (
    <div className="bg-slate-900/50 border border-slate-600 rounded-xl p-6">
      <div className="text-white text-lg font-semibold mb-4">Sales Trend</div>
      <ChartContainer data={salesTrend} config={{}}>
        <LineChart data={salesTrend} width={600} height={250} margin={{ top: 16, right: 32, left: 0, bottom: 32 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1", fontSize: 14 }}
            axisLine={{ stroke: "#334155" }}
          >
            <Label value="Date" offset={-8} position="insideBottom" fill="#cbd5e1" fontSize={14} />
          </XAxis>
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1", fontSize: 14 }}
            axisLine={{ stroke: "#334155" }}
          >
            <Label value="Sales" angle={-90} position="insideLeft" fill="#cbd5e1" fontSize={14} />
          </YAxis>
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              color: "#e0f2fe",
              fontSize: 14
            }}
            itemStyle={{ color: "#06b6d4" }}
            labelStyle={{ color: "#cbd5e1" }}
          />
          <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 14 }} />
          <Line
            type="monotone"
            dataKey="sales"
            name="Sales"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={{ r: 4, fill: "#0ea5e9", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#0ea5e9", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
} 