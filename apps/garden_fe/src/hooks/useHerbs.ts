'use client';

import { useCallback, useEffect, useState } from 'react';

import { herbService } from '@/services/herb.service';
import type { Herb } from '@/types/api';

export function useHerbs() {
  const [data, setData] = useState<Herb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const herbs = await herbService.getAll();
      setData(herbs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch herbs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
