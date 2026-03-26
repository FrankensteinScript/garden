'use client';

import { useCallback, useEffect, useState } from 'react';

import { historyService } from '@/services/history.service';
import type { History } from '@/types/api';

export function useHistory() {
  const [data, setData] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await historyService.getAll();
      setData(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
