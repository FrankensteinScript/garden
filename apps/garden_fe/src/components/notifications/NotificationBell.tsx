'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'prave ted';
  if (minutes < 60) return `pred ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `pred ${hours} hod`;
  const days = Math.floor(hours / 24);
  return `pred ${days} dny`;
}

export function NotificationBell() {
  const { data: notifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="relative rounded-full p-2 hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-white shadow-lg">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Upozorneni</h3>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Zadna upozorneni
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 border-b px-4 py-3 last:border-b-0',
                    !notification.isRead && 'bg-green-50/50'
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={notification.notificationType === 'emergency' ? 'destructive' : 'default'}
                        className="text-[10px]"
                      >
                        {notification.notificationType === 'emergency' ? 'Nouzove' : 'Varovani'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t px-4 py-2 text-center">
            <Link
              href="/notifications"
              className="text-sm text-green-600 hover:underline"
              onClick={() => setOpen(false)}
            >
              Zobrazit vse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
