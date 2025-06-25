/**
 * React Hooks for Mensa API
 * 
 * Custom hooks to use the Mensa API in React components
 */

import { useCallback, useEffect, useState } from 'react';
import { mensaApi } from '../services/mensaApi';

// Hook to get all canteens
export function useCanteens() {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await mensaApi.getCanteens();
      setData(result);
    } catch (err) {
      console.error('Error fetching canteens:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Mensen');
    } finally {
      setLoading(false);
    }
  }, []);

  // Only initialize once with a delay
  useEffect(() => {
    if (hasInitialized) return;
    
    const timer = setTimeout(() => {
      setHasInitialized(true);
      fetchData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasInitialized, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook to get today's menu for a specific canteen
export function useTodaysMenu(canteenId: string | null) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCanteenId, setLastCanteenId] = useState<string | null>(null);

  const fetchData = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mensaApi.getTodaysMenu(id);
      setData(result);
      setLastCanteenId(id);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Laden des Menüs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Only fetch when canteenId changes and is available
  useEffect(() => {
    if (!canteenId) {
      setData([]);
      setLoading(false);
      return;
    }

    // Avoid refetching the same data
    if (canteenId === lastCanteenId) {
      return;
    }

    // Debounce the fetch with a shorter timeout
    const timer = setTimeout(() => {
      fetchData(canteenId);
    }, 500);

    return () => clearTimeout(timer);
  }, [canteenId, lastCanteenId, fetchData]);

  const refetch = useCallback(() => {
    if (canteenId) {
      setLastCanteenId(null); // Reset to force refetch
      fetchData(canteenId);
    }
  }, [canteenId, fetchData]);

  return { data, loading, error, refetch };
}

// Hook for submitting reviews with state management
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
