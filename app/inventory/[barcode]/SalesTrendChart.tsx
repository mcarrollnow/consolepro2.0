"use client";
import { useState } from "react";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

const ranges = [
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "180 Days", value: 180 },
  { label: "1 Year", value: 365 }
];

function filterByRange(data: any[], days: number) {
  if (!Array.isArray(data) || data.length === 0) return [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return data.filter((d) => new Date(d.date) >= cutoff);
}

export default function SalesTrendChart({ salesTrend }: { salesTrend: any[] }) {
  const [range, setRange] = useState(90);
  const filteredData = filterByRange(salesTrend, range);

  if (!Array.isArray(salesTrend) || salesTrend.length === 0) {
    return <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-8 text-center text-slate-400">No sales trend data available.</div>;
  }
  return (
    <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white text-lg font-semibold">Sales Trend</div>
        <div className="flex gap-2">
          {ranges.map((r) => (
            <button
              key={r.value}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${range === r.value ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-cyan-700/40 hover:text-white"}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <ChartContainer data={filteredData} config={{}}>
        <LineChart data={filteredData} width={600} height={250} margin={{ top: 16, right: 32, left: 0, bottom: 16 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1", fontSize: 14 }}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#cbd5e1", fontSize: 14 }}
            axisLine={{ stroke: "#334155" }}
          />
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