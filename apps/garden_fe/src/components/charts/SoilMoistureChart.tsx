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

interface SoilMoistureChartProps {
  data?: { time: string; value: number }[];
  height?: number;
}

export function SoilMoistureChart({ data, height = 200 }: SoilMoistureChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Vlhkost pudy</CardTitle>
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
        <CardTitle className="text-base">Vlhkost pudy</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="soilGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a16207" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a16207" stopOpacity={0} />
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
              formatter={(val: any) => [`${val}%`, "Vlhkost pudy"] as any}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#a16207"
              strokeWidth={2}
              fill="url(#soilGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
