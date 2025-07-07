import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Navbar } from '@/components/Navbar/Index';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Wait for color scheme to be ready
  useEffect(() => {
    if (colorScheme !== null && loaded) {
      setIsReady(true);
    }
  }, [colorScheme, loaded]);

  if (!isReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GluestackUIProvider mode={colorScheme === 'dark' ? 'dark' : 'light'}>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Navbar />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              {/* <Stack.Screen name="+not-found" /> */}
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}
