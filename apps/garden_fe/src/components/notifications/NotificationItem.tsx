"use client";

import { Trash2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Notification } from "@/types/api";
import { formatRelativeDate } from "@/lib/formatDate";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const isWarning = notification.notificationType === "warning";
  const isEmergency = notification.notificationType === "emergency";

  return (
    <div
      className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
        notification.isRead ? "bg-background" : "bg-muted/30"
      } ${
        isWarning
          ? "border-l-4 border-l-yellow-500"
          : isEmergency
            ? "border-l-4 border-l-red-500"
            : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {isWarning && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100">
              Varovani
            </Badge>
          )}
          {isEmergency && (
            <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-100">
              Kriticke
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatRelativeDate(notification.createdAt)}
          </span>
        </div>
        <p
          className={`text-sm ${
            notification.isRead ? "font-normal text-muted-foreground" : "font-semibold text-foreground"
          }`}
        >
          {notification.message}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkRead(notification.id)}
            className="text-xs h-8"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Oznacit jako prectene
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(notification.id)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
