"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  GlassWater,
} from "lucide-react";
import { roomService } from "@/services/room.service";
import { herbService } from "@/services/herb.service";
import type { Room, Herb } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HerbCard } from "@/components/herbs/HerbCard";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
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
    }
    fetchData();
  }, [id]);

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
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Zpet
        </Button>
        <p className="text-muted-foreground">Mistnost nenalezena.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpet na prehled
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{room.name}</h1>
        {room.description && (
          <p className="mt-1 text-muted-foreground">{room.description}</p>
        )}
      </div>

      {/* Current readings */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Thermometer className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xl font-bold">{room.temperature}°C</p>
              <p className="text-xs text-muted-foreground">Teplota</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{room.humidity}%</p>
              <p className="text-xs text-muted-foreground">Vlhkost</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <GlassWater className="h-5 w-5 text-cyan-500" />
            <div>
              <p className="text-xl font-bold">{room.waterLevel}%</p>
              <p className="text-xs text-muted-foreground">Hladina vody</p>
            </div>
          </CardContent>
        </Card>
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
