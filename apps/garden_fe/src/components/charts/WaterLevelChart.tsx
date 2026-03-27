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

interface WaterLevelChartProps {
  data?: { time: string; value: number }[];
  height?: number;
}

export function WaterLevelChart({ data, height = 200 }: WaterLevelChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Hladina vody</CardTitle>
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
        <CardTitle className="text-base">Hladina vody</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="waterLevelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip
              formatter={(val: any) => [`${val}%`, "Hladina vody"] as any}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#waterLevelGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
