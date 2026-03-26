"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DEMO_DATA = [
  { time: "00:00", value: 20 },
  { time: "04:00", value: 19 },
  { time: "08:00", value: 21 },
  { time: "12:00", value: 24 },
  { time: "16:00", value: 23 },
  { time: "20:00", value: 21 },
  { time: "23:59", value: 20 },
];

interface TemperatureChartProps {
  data?: { time: string; value: number }[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  const chartData = data && data.length > 0 ? data : DEMO_DATA;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Teplota</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              unit="°C"
            />
            <Tooltip
              formatter={(val: number) => [`${val}°C`, "Teplota"]}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
