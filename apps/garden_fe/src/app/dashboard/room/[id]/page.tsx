"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  GlassWater,
  Droplet,
  Power,
} from "lucide-react";
import { roomService } from "@/services/room.service";
import { herbService } from "@/services/herb.service";
import { pumpCommandService } from "@/services/pumpCommand.service";
import { useSensorHistory } from "@/hooks/useSensorHistory";
import type { Room, Herb } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HerbCard } from "@/components/herbs/HerbCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { LastUpdated } from "@/components/dashboard/LastUpdated";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { HumidityChart } from "@/components/charts/HumidityChart";
import { SoilMoistureChart } from "@/components/charts/SoilMoistureChart";
import { useToast } from "@/components/ui/toast";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();

  const [room, setRoom] = useState<Room | null>(null);
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [loading, setLoading] = useState(true);
  const [pumpLoading, setPumpLoading] = useState(false);

  const { data: sensorHistory } = useSensorHistory(id, 24);

  const fetchData = useCallback(async () => {
    try {
      const [roomData, allHerbs] = await Promise.all([
        roomService.getById(id),
        herbService.getAll(),
      ]);
      setRoom(roomData);
      setHerbs(allHerbs.filter((h) => h.roomId === id));
    } catch {
      // handle error silently
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  async function handlePump(durationSeconds: number) {
    try {
      setPumpLoading(true);
      await pumpCommandService.trigger(id, { action: "on", durationSeconds });
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Zpet
        </Button>
        <p className="text-muted-foreground">Mistnost nenalezena.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpet na prehled
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{room.name}</h1>
          {room.description && (
            <p className="mt-1 text-muted-foreground">{room.description}</p>
          )}
        </div>
        <LastUpdated updatedAt={room.updatedAt} />
      </div>

      {/* Current readings */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  herbs.reduce((s, h) => s + h.soilMoisture, 0) / herbs.length
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
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <span className="text-sm font-medium">Ovladani cerpadla:</span>
          <Button
            onClick={() => handlePump(5)}
            disabled={pumpLoading}
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Power className="mr-1 h-4 w-4" />
            5s
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePump(10)}
            disabled={pumpLoading}
            size="sm"
          >
            10s
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePump(15)}
            disabled={pumpLoading}
            size="sm"
          >
            15s
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePump(30)}
            disabled={pumpLoading}
            size="sm"
          >
            30s
          </Button>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <TemperatureChart data={tempData} />
        <HumidityChart data={humidityData} />
        <SoilMoistureChart data={soilData} />
      </div>

      {/* Herbs grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Bylinky v mistnosti</h2>
        {herbs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {herbs.map((herb) => (
              <HerbCard key={herb.id} herb={herb} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                V teto mistnosti nejsou zadne bylinky.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
