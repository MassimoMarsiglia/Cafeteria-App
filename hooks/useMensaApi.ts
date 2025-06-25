/**
 * React Hooks for Mensa API
 * 
 * Simple and efficient hooks to use the Mensa API in React components
 */

import { useCallback, useEffect, useState } from 'react';
import { mensaApi } from '../services/mensaApi';

// Simple cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Simple global cache
const cache = {
  canteens: null as CacheEntry<any[]> | null,
  menus: new Map<string, CacheEntry<any[]>>(),
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if cache is valid
function isCacheValid(entry: CacheEntry<any> | null): boolean {
  return entry !== null && Date.now() - entry.timestamp < CACHE_DURATION;
}

// Hook to get all canteens with simple caching
export function useCanteens() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    if (isCacheValid(cache.canteens)) {
      setData(cache.canteens!.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await mensaApi.getCanteens();
      cache.canteens = {
        data: result,
        timestamp: Date.now()
      };
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Laden der Mensen';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    cache.canteens = null;
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook to get today's menu for a specific canteen with simple caching
export function useTodaysMenu(canteenId: string | null) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (id: string) => {
    // Check cache first
    const cacheEntry = cache.menus.get(id);
    if (cacheEntry && isCacheValid(cacheEntry)) {
      setData(cacheEntry.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await mensaApi.getTodaysMenu(id);
      cache.menus.set(id, {
        data: result,
        timestamp: Date.now()
      });
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Laden des Menüs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!canteenId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Validate canteenId format
    if (typeof canteenId !== 'string' || canteenId.length !== 24) {
      setError('Ungültige Mensa-ID');
      setLoading(false);
      return;
    }

    fetchData(canteenId);
  }, [canteenId, fetchData]);

  const refetch = useCallback(() => {
    if (canteenId) {
      cache.menus.delete(canteenId);
      fetchData(canteenId);
    }
  }, [canteenId, fetchData]);

  return { data, loading, error, refetch };
}

// Hook for submitting reviews
export function useSubmitReview() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitMealReview = useCallback(async (mealId: string, rating: number, comment?: string) => {
    try {
      setSubmitting(true);
      setError(null);
      const result = await mensaApi.createMealReview({ mealId, rating, comment });
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const submitCanteenReview = useCallback(async (canteenId: string, rating: number, comment?: string) => {
    try {
      setSubmitting(true);
      setError(null);
      const result = await mensaApi.createCanteenReview({ canteenId, rating, comment });
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitMealReview, submitCanteenReview, submitting, error };
}

// Simple cache management functions
export const cacheManager = {
  clearAll: () => {
    cache.canteens = null;
    cache.menus.clear();
  },
  
  clearCanteens: () => {
    cache.canteens = null;
  },
  
  clearMenu: (canteenId: string) => {
    cache.menus.delete(canteenId);
  },
  
  clearAllMenus: () => {
    cache.menus.clear();
  },
  
  getStats: () => {
    const now = Date.now();
    return {
      canteens: {
        cached: !!cache.canteens,
        valid: isCacheValid(cache.canteens),
        age: cache.canteens ? now - cache.canteens.timestamp : null,
        itemCount: cache.canteens?.data?.length || 0
      },
      menus: {
        cachedCanteens: cache.menus.size,
        validCaches: Array.from(cache.menus.values()).filter(entry => isCacheValid(entry)).length,
        totalItems: Array.from(cache.menus.values()).reduce((sum, entry) => sum + (entry.data?.length || 0), 0)
      }
    };
  }
};
