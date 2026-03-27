"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Leaf,
  Droplet,
  Thermometer,
  Droplets,
  CalendarDays,
} from "lucide-react";
import { herbService } from "@/services/herb.service";
import { historyService } from "@/services/history.service";
import { growConditionsService } from "@/services/growConditions.service";
import type { Herb, History, GrowConditions } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { WateringHistoryChart } from "@/components/charts/WateringHistoryChart";
import { HerbActions } from "@/components/herbs/HerbActions";

export default function HerbDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [herb, setHerb] = useState<Herb | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [growConditions, setGrowConditions] = useState<GrowConditions | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [herbData, allHistory] = await Promise.all([
        herbService.getById(id),
        historyService.getAll(),
      ]);
      setHerb(herbData);
      setHistory(
        allHistory
          .filter((h) => h.herbId === id)
          .sort(
            (a, b) =>
              new Date(b.wateredAt).getTime() - new Date(a.wateredAt).getTime()
          )
      );

      if (herbData.growConditionId) {
        try {
          const gc = await growConditionsService.getById(
            herbData.growConditionId
          );
          setGrowConditions(gc);
        } catch {
          // grow conditions may not exist
        }
      }
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!herb) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Zpet
        </Button>
        <p className="text-muted-foreground">Bylinka nenalezena.</p>
      </div>
    );
  }

  function isInRange(value: number, min: number, max: number) {
    return value >= min && value <= max;
  }

  const chartData = history.map((h) => ({
    date: new Date(h.wateredAt).toLocaleDateString("cs-CZ"),
    amount: h.amountWater,
  }));

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpet
      </Button>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
          <Leaf className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{herb.name}</h1>
          <p className="text-muted-foreground">{herb.description}</p>
        </div>
      </div>

      {/* Current readings cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Droplet className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{herb.soilMoisture}%</p>
              <p className="text-xs text-muted-foreground">Vlhkost pudy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Thermometer className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xl font-bold">{herb.temperature}°C</p>
              <p className="text-xs text-muted-foreground">Teplota</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Droplets className="h-5 w-5 text-cyan-500" />
            <div>
              <p className="text-xl font-bold">{herb.humidity}%</p>
              <p className="text-xs text-muted-foreground">Vlhkost</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CalendarDays className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xl font-bold">
                {herb.lastWatering
                  ? new Date(herb.lastWatering).toLocaleDateString("cs-CZ")
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Posledni zaliti</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grow conditions comparison */}
      {growConditions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Porovnani s optimalni podminkami
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Teplota</p>
                  <p className="text-xs text-muted-foreground">
                    Optimalni: {growConditions.minTemperature}–
                    {growConditions.maxTemperature}°C
                  </p>
                </div>
                <Badge
                  variant={
                    isInRange(
                      herb.temperature,
                      growConditions.minTemperature,
                      growConditions.maxTemperature
                    )
                      ? "default"
                      : "destructive"
                  }
                >
                  {herb.temperature}°C
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Vlhkost</p>
                  <p className="text-xs text-muted-foreground">
                    Optimalni: {growConditions.minHumidity}–
                    {growConditions.maxHumidity}%
                  </p>
                </div>
                <Badge
                  variant={
                    isInRange(
                      herb.humidity,
                      growConditions.minHumidity,
                      growConditions.maxHumidity
                    )
                      ? "default"
                      : "destructive"
                  }
                >
                  {herb.humidity}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions row */}
      <HerbActions herbId={id} roomId={herb.roomId} onWatered={fetchData} />

      {/* Watering history chart */}
      <WateringHistoryChart data={chartData} />

      {/* History table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historie zalevani</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Datum</th>
                    <th className="pb-2 pr-4 font-medium">Mnozstvi</th>
                    <th className="pb-2 pr-4 font-medium">Teplota</th>
                    <th className="pb-2 font-medium">Poznamky</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        {new Date(h.wateredAt).toLocaleString("cs-CZ")}
                      </td>
                      <td className="py-2 pr-4">{h.amountWater} ml</td>
                      <td className="py-2 pr-4">{h.temperature}°C</td>
                      <td className="py-2 text-muted-foreground">
                        {h.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Zatim zadna historie zalevani.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
