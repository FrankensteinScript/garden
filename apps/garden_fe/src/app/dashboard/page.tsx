"use client";

import { Thermometer, Droplets, GlassWater, Plus } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { useHerbs } from "@/hooks/useHerbs";
import { useNotifications } from "@/hooks/useNotifications";
import { StatCard } from "@/components/dashboard/StatCard";
import { RoomCard } from "@/components/dashboard/RoomCard";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { HumidityChart } from "@/components/charts/HumidityChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: rooms, loading: roomsLoading } = useRooms();
  const { loading: herbsLoading } = useHerbs();
  const { data: notifications, loading: notificationsLoading } =
    useNotifications();

  const isLoading = roomsLoading || herbsLoading || notificationsLoading;

  const avgTemperature =
    rooms.length > 0
      ? (rooms.reduce((sum, r) => sum + r.temperature, 0) / rooms.length).toFixed(1)
      : "--";

  const avgHumidity =
    rooms.length > 0
      ? (rooms.reduce((sum, r) => sum + r.humidity, 0) / rooms.length).toFixed(1)
      : "--";

  const avgWaterLevel =
    rooms.length > 0
      ? (rooms.reduce((sum, r) => sum + r.waterLevel, 0) / rooms.length).toFixed(1)
      : "--";

  const recentNotifications = [...notifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Prehled zahrady</h1>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Thermometer}
          label="Prumerna teplota"
          value={avgTemperature}
          unit="°C"
          color="text-red-500"
        />
        <StatCard
          icon={Droplets}
          label="Prumerna vlhkost"
          value={avgHumidity}
          unit="%"
          color="text-blue-500"
        />
        <StatCard
          icon={GlassWater}
          label="Prumerna hladina vody"
          value={avgWaterLevel}
          unit="%"
          color="text-cyan-500"
        />
      </div>

      {/* Room cards grid */}
      {rooms.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">Zadne mistnosti</p>
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Vytvorit mistnost
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Charts section */}
      <div className="grid gap-4 md:grid-cols-2">
        <TemperatureChart />
        <HumidityChart />
      </div>

      {/* Recent notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Posledni notifikace</CardTitle>
        </CardHeader>
        <CardContent>
          {recentNotifications.length > 0 ? (
            <ul className="space-y-3">
              {recentNotifications.map((n) => (
                <li key={n.id} className="flex items-start gap-3 text-sm">
                  <Badge
                    variant={
                      n.notificationType === "emergency"
                        ? "destructive"
                        : "secondary"
                    }
                    className="mt-0.5 shrink-0"
                  >
                    {n.notificationType === "emergency"
                      ? "Nouzove"
                      : "Varovani"}
                  </Badge>
                  <div>
                    <p>{n.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.createdAt).toLocaleString("cs-CZ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Zadne notifikace k zobrazeni.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
