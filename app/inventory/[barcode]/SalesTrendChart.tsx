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
  return (
    <ChartContainer data={salesTrend} config={{}}>
      <LineChart data={salesTrend} width={600} height={250}>
        <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ChartContainer>
  );
} 