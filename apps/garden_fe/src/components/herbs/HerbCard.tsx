"use client";

import { useRouter } from "next/navigation";
import { Thermometer, Droplets, Droplet, Leaf } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Herb, PlantType } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const PLANT_TYPE_LABELS: Record<PlantType, string> = {
  herb: "Bylinka",
  flower: "Kvetina",
  vegetable: "Zelenina",
  fruit: "Ovoce",
  other: "Ostatni",
};

const PLANT_TYPE_COLORS: Record<PlantType, string> = {
  herb: "bg-green-100 text-green-800",
  flower: "bg-pink-100 text-pink-800",
  vegetable: "bg-orange-100 text-orange-800",
  fruit: "bg-purple-100 text-purple-800",
  other: "bg-gray-100 text-gray-800",
};

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
  const plantType = herb.plantType || "herb";

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md overflow-hidden"
      onClick={() => router.push(`/dashboard/herb/${herb.id}`)}
    >
      {/* Image or placeholder */}
      <div className="h-32 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
        {herb.imageUrl ? (
          <img
            src={`${API_URL}${herb.imageUrl}`}
            alt={herb.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Leaf className="h-12 w-12 text-green-200" />
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{herb.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={PLANT_TYPE_COLORS[plantType]}
            >
              {PLANT_TYPE_LABELS[plantType]}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
              {status.label}
            </span>
          </div>
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
