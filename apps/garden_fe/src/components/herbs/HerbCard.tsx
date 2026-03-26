"use client";

import { useRouter } from "next/navigation";
import { Thermometer, Droplets, Droplet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Herb } from "@/types/api";

interface HerbCardProps {
  herb: Herb;
}

function getStatus(herb: Herb): { color: string; label: string } {
  if (herb.soilMoisture < 20 || herb.temperature > 35 || herb.temperature < 5) {
    return { color: "bg-red-500", label: "Kriticke" };
  }
  if (herb.soilMoisture < 40 || herb.temperature > 30 || herb.temperature < 10) {
    return { color: "bg-yellow-500", label: "Varovani" };
  }
  return { color: "bg-green-500", label: "V poradku" };
}

export function HerbCard({ herb }: HerbCardProps) {
  const router = useRouter();
  const status = getStatus(herb);

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => router.push(`/dashboard/herb/${herb.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{herb.name}</CardTitle>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
            {status.label}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Droplet className="h-4 w-4 text-blue-500" />
            {herb.soilMoisture}%
          </span>
          <span className="flex items-center gap-1">
            <Thermometer className="h-4 w-4 text-red-500" />
            {herb.temperature}°C
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="h-4 w-4 text-cyan-500" />
            {herb.humidity}%
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Posledni zaliti:{" "}
          {herb.lastWatering
            ? new Date(herb.lastWatering).toLocaleDateString("cs-CZ")
            : "N/A"}
        </p>
      </CardContent>
    </Card>
  );
}
