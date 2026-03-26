"use client";

import { useState, useCallback } from "react";
import { BellOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationService } from "@/services/notification.service";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import type { NotificationType } from "@/types/api";

type FilterTab = "all" | NotificationType;

export default function NotificationsPage() {
  const { data: notifications, loading, refetch } = useNotifications();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.notificationType === activeTab);

  const handleMarkRead = useCallback(
    async (id: string) => {
      await notificationService.markAsRead(id);
      refetch();
    },
    [refetch]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await notificationService.remove(id);
      refetch();
    },
    [refetch]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Upozorneni</h1>
        {unreadCount > 0 && (
          <Badge variant="default">{unreadCount} neprectenych</Badge>
        )}
      </div>

      <Tabs defaultValue="all" onValueChange={(v) => setActiveTab(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">Vsechna</TabsTrigger>
          <TabsTrigger value="warning">Varovani</TabsTrigger>
          <TabsTrigger value="emergency">Kriticka</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BellOff className="h-12 w-12 mb-4" />
              <p className="text-lg">Zadna upozorneni</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
