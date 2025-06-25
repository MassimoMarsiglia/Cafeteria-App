import { useEffect } from 'react';
import { AppState } from 'react-native';
import { cacheManager } from './useMensaApi';

/**
 * Hook to clean up resources when the app goes to background
 * This helps prevent memory leaks during app state changes
 */
export function useAppStateCleanup() {
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                // Clean up cache when app goes to background
                cacheManager.cleanup();
            }
        };

        const subscription = AppState.addEventListener(
            'change',
            handleAppStateChange,
        );

        return () => {
            subscription?.remove();
        };
    }, []);
}
