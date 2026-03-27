'use client';

import { useCallback, useEffect, useState } from 'react';
import { sensorReadingService } from '@/services/sensorReading.service';
import type { SensorReading } from '@/types/api';

export function useSensorHistory(roomId: string, hours = 24) {
  const [data, setData] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const from = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      const readings = await sensorReadingService.getByRoom(roomId, from);
      setData(readings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sensor data');
    } finally {
      setLoading(false);
    }
  }, [roomId, hours]);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
