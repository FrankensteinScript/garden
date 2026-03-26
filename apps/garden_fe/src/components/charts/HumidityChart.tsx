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
  { time: "00:00", value: 55 },
  { time: "04:00", value: 58 },
  { time: "08:00", value: 52 },
  { time: "12:00", value: 48 },
  { time: "16:00", value: 50 },
  { time: "20:00", value: 54 },
  { time: "23:59", value: 56 },
];

interface HumidityChartProps {
  data?: { time: string; value: number }[];
}

export function HumidityChart({ data }: HumidityChartProps) {
  const chartData = data && data.length > 0 ? data : DEMO_DATA;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Vlhkost</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
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
              unit="%"
            />
            <Tooltip
              formatter={(val: any) => [`${val}%`, "Vlhkost"] as any}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={2}
              fill="url(#humidityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
