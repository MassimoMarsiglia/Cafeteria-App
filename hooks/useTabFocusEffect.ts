import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

/**
 * Hook to prevent memory leaks when switching between tabs
 * This hook runs cleanup when the screen loses focus
 */
export function useTabFocusEffect(cleanup?: () => void) {
  useFocusEffect(
    useCallback(() => {
      // This runs when the screen comes into focus
      return () => {
        // This runs when the screen goes out of focus
        if (cleanup) {
          cleanup();
        }
      };
    }, [cleanup]),
  );
}
