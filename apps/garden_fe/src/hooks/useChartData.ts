'use client';

import { useCallback, useEffect, useState } from 'react';
import { sensorReadingService } from '@/services/sensorReading.service';
import type { SensorReading } from '@/types/api';

export type TimeRange = '24h' | '7d' | '30d' | 'custom';

const RANGE_CONFIG: Record<Exclude<TimeRange, 'custom'>, { hours: number; limit: number }> = {
  '24h': { hours: 24, limit: 500 },
  '7d': { hours: 7 * 24, limit: 1000 },
  '30d': { hours: 30 * 24, limit: 2000 },
};

export function useChartData(
  roomId: string | null,
  range: TimeRange,
  customFrom?: string,
  customTo?: string
) {
  const [data, setData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!roomId) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      let from: string;
      let to: string | undefined;
      let limit: number;

      if (range === 'custom') {
        from = customFrom ? new Date(customFrom).toISOString() : new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        to = customTo ? new Date(customTo + 'T23:59:59').toISOString() : undefined;
        limit = 2000;
      } else {
        const config = RANGE_CONFIG[range];
        from = new Date(Date.now() - config.hours * 60 * 60 * 1000).toISOString();
        to = undefined;
        limit = config.limit;
      }

      const readings = await sensorReadingService.getByRoom(roomId, from, to, limit);
      setData(readings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nepodařilo se načíst data');
    } finally {
      setLoading(false);
    }
  }, [roomId, range, customFrom, customTo]);

  useEffect(() => {
    setLoading(true);
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
