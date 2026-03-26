"use client";

import { useRouter } from "next/navigation";
import { Thermometer, Droplets, GlassWater, Leaf } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Room } from "@/types/api";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => router.push(`/room/${room.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{room.name}</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Leaf className="h-3 w-3" />
            {room.herbIds.length}
          </Badge>
        </div>
        {room.description && (
          <CardDescription className="line-clamp-2">
            {room.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Thermometer className="h-4 w-4 text-red-500" />
            {room.temperature}°C
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="h-4 w-4 text-blue-500" />
            {room.humidity}%
          </span>
          <span className="flex items-center gap-1">
            <GlassWater className="h-4 w-4 text-cyan-500" />
            {room.waterLevel}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
