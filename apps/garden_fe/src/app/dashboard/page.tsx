"use client";

import { useEffect, useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { useHerbs } from "@/hooks/useHerbs";
import { useNotifications } from "@/hooks/useNotifications";
import { RoomSection } from "@/components/dashboard/RoomSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: rooms, loading: roomsLoading, refetch: refetchRooms } = useRooms();
  const { data: herbs, loading: herbsLoading, refetch: refetchHerbs } = useHerbs();
  const {
    data: notifications,
    loading: notificationsLoading,
  } = useNotifications();

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRooms();
      refetchHerbs();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchRooms, refetchHerbs]);

  const isLoading = roomsLoading || herbsLoading || notificationsLoading;

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
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Prehled zahrady</h1>

      {/* Room sections */}
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <RoomSection
            key={room.id}
            room={room}
            herbs={herbs.filter((h) => h.roomId === room.id)}
          />
        ))
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

      {/* Recent notifications */}
      {recentNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Posledni notifikace</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
