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

interface TemperatureChartProps {
  data?: { time: string; value: number }[];
  height?: number;
}

export function TemperatureChart({ data, height = 200 }: TemperatureChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Teplota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>
            Zadna data ze senzoru
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Teplota</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              unit="°C"
            />
            <Tooltip
              formatter={(val: any) => [`${val}°C`, "Teplota"] as any}
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
