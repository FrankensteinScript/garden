"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DEMO_DATA = [
  { date: "Po", amount: 150 },
  { date: "Ut", amount: 0 },
  { date: "St", amount: 200 },
  { date: "Ct", amount: 0 },
  { date: "Pa", amount: 180 },
  { date: "So", amount: 100 },
  { date: "Ne", amount: 0 },
];

interface WateringHistoryChartProps {
  data?: { date: string; amount: number }[];
}

export function WateringHistoryChart({ data }: WateringHistoryChartProps) {
  const chartData = data && data.length > 0 ? data : DEMO_DATA;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Historie zalevani</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              unit=" ml"
            />
            <Tooltip
              formatter={(val: number) => [`${val} ml`, "Mnozstvi"]}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <Bar
              dataKey="amount"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
