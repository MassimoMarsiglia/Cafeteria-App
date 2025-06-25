/**
 * React Hooks for Mensa API
 *
 * Simple and efficient hooks to use the Mensa API in React components
 * Updated to match Swagger API specification
 */

import { useCallback, useEffect, useState } from 'react';
import {
    Canteen,
    CanteenReview,
    CreateCanteenReviewRequest,
    CreateMealReviewRequest,
    MealReview,
    mensaApi,
    Menu,
} from '../services/mensaApi';

// Simple cache interface
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

// Simple global cache using correct types
const cache = {
    canteens: null as CacheEntry<Canteen[]> | null,
    menus: new Map<string, CacheEntry<Menu[]>>(),
};

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes (reduced from 5 for more frequent updates)

// Helper function to check if cache is valid
function isCacheValid(entry: CacheEntry<any> | null): boolean {
    return entry !== null && Date.now() - entry.timestamp < CACHE_DURATION;
}

// Hook to get all canteens with simple caching
export function useCanteens() {
    const [data, setData] = useState<Canteen[] | null>(null);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false; // Flag to prevent setting state if component unmounted

        const fetchData = async () => {
            if (isCancelled) return;

            // Check cache first
            if (isCacheValid(cache.canteens)) {
                if (!isCancelled) {
                    setData(cache.canteens!.data);
                    setLoading(false);
                }
                return;
            }

            if (!isCancelled) {
                setLoading(true);
                setError(null);
            }

            try {
                console.log('Starting to fetch canteens...');
                const result = await mensaApi.getCanteensWithFallback();
                console.log('Canteens loaded:', result.length);

                if (!isCancelled) {
                    cache.canteens = {
                        data: result,
                        timestamp: Date.now(),
                    };
                    setData(result);
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Fehler beim Laden der Mensen';
                console.log('Error loading canteens:', err);
                if (!isCancelled) {
                    setError(errorMessage);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function to cancel any ongoing operations
        return () => {
            isCancelled = true;
        };
    }, []); // No dependencies to prevent loops

    const refetch = useCallback(() => {
        cache.canteens = null;
        // Trigger refetch by clearing cache and calling useEffect logic
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await mensaApi.getCanteensWithFallback();
                cache.canteens = {
                    data: result,
                    timestamp: Date.now(),
                };
                setData(result);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Fehler beim Laden der Mensen';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { data, loading, error, refetch };
}

// Hook to get today's menu for a specific canteen with simple caching
export function useTodaysMenu(canteenId: string | null) {
    const [data, setData] = useState<Menu[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false; // Flag to prevent setting state if component unmounted

        const fetchData = async (id: string) => {
            if (isCancelled) return;

            // Check cache first
            const cacheEntry = cache.menus.get(id);
            if (cacheEntry && isCacheValid(cacheEntry)) {
                console.log('Using cached menu for:', id);
                if (!isCancelled) {
                    setData(cacheEntry.data);
                }
                return;
            }

            if (!isCancelled) {
                setLoading(true);
                setError(null);
            }

            try {
                console.log('Calling mensaApi.getTodaysMenu with ID:', id);
                // Immediate API call for better responsiveness
                const result = await mensaApi.getTodaysMenu(id);
                console.log('Menu result:', result);

                if (!isCancelled) {
                    cache.menus.set(id, {
                        data: result,
                        timestamp: Date.now(),
                    });
                    setData(result);
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Fehler beim Laden des Menüs';
                console.log('Error loading menu:', err);
                if (!isCancelled) {
                    setError(errorMessage);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        if (!canteenId) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        // Validate canteenId format (MongoDB ObjectID should be 24 hex characters)
        if (typeof canteenId !== 'string' || canteenId.length !== 24) {
            console.log('Invalid canteen ID format:', {
                canteenId,
                length: canteenId?.length,
                type: typeof canteenId,
            });
            setError(
                `Ungültige Mensa-ID: ${canteenId} (Länge: ${canteenId?.length})`,
            );
            setLoading(false);
            return;
        }

        console.log('Fetching menu for canteen ID:', canteenId);
        // Immediate fetch for better responsiveness
        fetchData(canteenId);

        // Cleanup function to cancel any ongoing operations
        return () => {
            isCancelled = true;
        };
    }, [canteenId]); // Only depend on canteenId

    const refetch = useCallback(() => {
        if (canteenId) {
            cache.menus.delete(canteenId);

            const fetchData = async () => {
                setLoading(true);
                setError(null);

                try {
                    const result = await mensaApi.getTodaysMenu(canteenId);
                    cache.menus.set(canteenId, {
                        data: result,
                        timestamp: Date.now(),
                    });
                    setData(result);
                } catch (err) {
                    const errorMessage =
                        err instanceof Error
                            ? err.message
                            : 'Fehler beim Laden des Menüs';
                    setError(errorMessage);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [canteenId]);

    return { data, loading, error, refetch };
}

// Hook for submitting reviews
export function useSubmitReview() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitMealReview = useCallback(
        async (mealId: string, rating: number, comment?: string) => {
            try {
                setSubmitting(true);
                setError(null);
                // Create proper review object matching API specification
                const reviewRequest: CreateMealReviewRequest = {
                    mealID: mealId, // API uses mealID not mealId
                    userID: 'user12345', // TODO: Get actual user ID
                    detailRatings: [{ rating, name: 'Essen' }],
                    comment,
                };
                const result = await mensaApi.createMealReview(reviewRequest);
                return result;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                throw err;
            } finally {
                setSubmitting(false);
            }
        },
        [],
    );

    const submitCanteenReview = useCallback(
        async (canteenId: string, rating: number, comment?: string) => {
            try {
                setSubmitting(true);
                setError(null);
                // Create proper review object matching API specification
                const reviewRequest: CreateCanteenReviewRequest = {
                    canteenID: canteenId, // API uses canteenID not canteenId
                    userID: 'user12345', // TODO: Get actual user ID
                    detailRatings: [{ rating, name: 'Essen' }],
                    comment,
                };
                const result =
                    await mensaApi.createCanteenReview(reviewRequest);
                return result;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                throw err;
            } finally {
                setSubmitting(false);
            }
        },
        [],
    );

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

    // Clean up old cache entries to prevent memory leaks
    cleanup: () => {
        const now = Date.now();

        // Clean canteens cache if expired
        if (cache.canteens && !isCacheValid(cache.canteens)) {
            cache.canteens = null;
        }

        // Clean expired menu caches
        for (const [key, entry] of cache.menus.entries()) {
            if (!isCacheValid(entry)) {
                cache.menus.delete(key);
            }
        }
    },

    getStats: () => {
        const now = Date.now();
        return {
            canteens: {
                cached: !!cache.canteens,
                valid: isCacheValid(cache.canteens),
                age: cache.canteens ? now - cache.canteens.timestamp : null,
                itemCount: cache.canteens?.data?.length || 0,
            },
            menus: {
                cachedCanteens: cache.menus.size,
                validCaches: Array.from(cache.menus.values()).filter(entry =>
                    isCacheValid(entry),
                ).length,
                totalItems: Array.from(cache.menus.values()).reduce(
                    (sum, entry) => sum + (entry.data?.length || 0),
                    0,
                ),
            },
        };
    },

    initCleanup: initCacheCleanup,
    stopCleanup: stopCacheCleanup,
};

// Initialize cache cleanup interval only once
let cleanupInterval: number | null = null;
let isCleanupActive = false;

// Function to start cache cleanup if not already running
function initCacheCleanup() {
    if (!cleanupInterval && !isCleanupActive) {
        isCleanupActive = true;
        cleanupInterval = setInterval(
            () => {
                cacheManager.cleanup();
            },
            5 * 60 * 1000,
        ); // Clean up every 5 minutes
    }
}

// Function to stop cache cleanup
function stopCacheCleanup() {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
        isCleanupActive = false;
    }
}

// Add cleanup functions to cacheManager
// Start cleanup when module loads
initCacheCleanup();

// Additional hooks for extended API functionality

// Hook to get meals with filtering
export function useMeals(filter?: import('../services/mensaApi').MealFilter) {
    const [data, setData] = useState<
        import('../services/mensaApi').Meal[] | null
    >(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMeals = useCallback(
        async (mealFilter?: import('../services/mensaApi').MealFilter) => {
            setLoading(true);
            setError(null);

            try {
                const result = await mensaApi.getMeals(mealFilter);
                setData(result);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Fehler beim Laden der Gerichte';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        fetchMeals(filter);
    }, [fetchMeals, filter]);

    const refetch = useCallback(() => {
        fetchMeals(filter);
    }, [fetchMeals, filter]);

    return { data, loading, error, refetch };
}

// Hook to get reviews for a meal
export function useMealReviews(mealId?: string) {
    const [data, setData] = useState<MealReview[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async (id?: string) => {
        if (!id) {
            setData(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await mensaApi.getMealReviews({ mealId: id });
            setData(result);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Fehler beim Laden der Bewertungen';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews(mealId);
    }, [fetchReviews, mealId]);

    const refetch = useCallback(() => {
        fetchReviews(mealId);
    }, [fetchReviews, mealId]);

    return { data, loading, error, refetch };
}

// Hook to get reviews for a canteen
export function useCanteenReviews(canteenId?: string) {
    const [data, setData] = useState<CanteenReview[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async (id?: string) => {
        if (!id) {
            setData(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await mensaApi.getCanteenReviews({ canteenId: id });
            setData(result);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Fehler beim Laden der Bewertungen';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews(canteenId);
    }, [fetchReviews, canteenId]);

    const refetch = useCallback(() => {
        fetchReviews(canteenId);
    }, [fetchReviews, canteenId]);

    return { data, loading, error, refetch };
}

// Hook to get badges and additives
export function useBadgesAndAdditives() {
    const [badges, setBadges] = useState<
        import('../services/mensaApi').Badge[] | null
    >(null);
    const [additives, setAdditives] = useState<
        import('../services/mensaApi').Additive[] | null
    >(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [badgeResults, additiveResults] = await Promise.all([
                mensaApi.getBadges(),
                mensaApi.getAdditives(),
            ]);
            setBadges(badgeResults);
            setAdditives(additiveResults);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Fehler beim Laden der Daten';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { badges, additives, loading, error, refetch };
}
