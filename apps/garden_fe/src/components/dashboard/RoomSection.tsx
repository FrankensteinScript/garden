"use client";

import { useState } from "react";
import {
  Thermometer,
  Droplets,
  GlassWater,
  Droplet,
  Leaf,
  Power,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { LastUpdated } from "@/components/dashboard/LastUpdated";
import { HerbCard } from "@/components/herbs/HerbCard";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { HumidityChart } from "@/components/charts/HumidityChart";
import { SoilMoistureChart } from "@/components/charts/SoilMoistureChart";
import { useSensorHistory } from "@/hooks/useSensorHistory";
import { pumpCommandService } from "@/services/pumpCommand.service";
import { useToast } from "@/components/ui/toast";
import type { Room, Herb } from "@/types/api";

interface RoomSectionProps {
  room: Room;
  herbs: Herb[];
}

export function RoomSection({ room, herbs }: RoomSectionProps) {
  const { data: sensorHistory } = useSensorHistory(room.id, 24);
  const [pumpLoading, setPumpLoading] = useState(false);
  const { toast } = useToast();

  const tempData = sensorHistory.map((r) => ({
    time: new Date(r.createdAt).toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: r.temperature,
  }));

  const humidityData = sensorHistory.map((r) => ({
    time: new Date(r.createdAt).toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: r.humidity,
  }));

  const soilData = sensorHistory.map((r) => ({
    time: new Date(r.createdAt).toLocaleTimeString("cs-CZ", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: r.soilMoisture,
  }));

  async function handlePump(durationSeconds: number) {
    try {
      setPumpLoading(true);
      await pumpCommandService.trigger(room.id, {
        action: "on",
        durationSeconds,
      });
      toast({
        title: "Pumpa spustena",
        description: `Cerpadlo bezi ${durationSeconds} sekund.`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo se spustit cerpadlo.",
        variant: "error",
      });
    } finally {
      setPumpLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">{room.name}</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Leaf className="h-3 w-3" />
              {herbs.length} {herbs.length === 1 ? "bylinka" : "bylinek"}
            </Badge>
          </div>
          <LastUpdated updatedAt={room.updatedAt} />
        </div>
        {room.description && (
          <p className="text-sm text-muted-foreground">{room.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Live metrics */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Thermometer}
            label="Teplota"
            value={room.temperature}
            unit="°C"
            color="text-red-500"
          />
          <StatCard
            icon={Droplets}
            label="Vlhkost vzduchu"
            value={room.humidity}
            unit="%"
            color="text-blue-500"
          />
          <StatCard
            icon={Droplet}
            label="Vlhkost pudy"
            value={
              herbs.length > 0
                ? (
                    herbs.reduce((s, h) => s + h.soilMoisture, 0) /
                    herbs.length
                  ).toFixed(0)
                : "--"
            }
            unit="%"
            color="text-amber-600"
          />
          <StatCard
            icon={GlassWater}
            label="Hladina vody"
            value={room.waterLevel}
            unit="%"
            color="text-cyan-500"
          />
        </div>

        {/* Pump control */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handlePump(5)}
            disabled={pumpLoading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Power className="mr-1 h-4 w-4" />
            {pumpLoading ? "Spoustim..." : "Zalit (5s)"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePump(10)}
            disabled={pumpLoading}
          >
            <Power className="mr-1 h-4 w-4" />
            Zalit (10s)
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePump(15)}
            disabled={pumpLoading}
          >
            <Power className="mr-1 h-4 w-4" />
            Zalit (15s)
          </Button>
        </div>

        {/* Charts - 24h trends */}
        <div className="grid gap-4 md:grid-cols-3">
          <TemperatureChart data={tempData} />
          <HumidityChart data={humidityData} />
          <SoilMoistureChart data={soilData} />
        </div>

        {/* Herbs in this room */}
        {herbs.length > 0 && (
          <div>
            <h3 className="mb-3 text-base font-semibold">Bylinky</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {herbs.map((herb) => (
                <HerbCard key={herb.id} herb={herb} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
