import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useSettings } from '@/hooks/redux/useSettings';
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';

// Create a wrapper component that has access to Redux
function AppContent() {
  const { isDarkMode } = useSettings();
  const colorscheme = useColorScheme();

  const themeMode = isDarkMode ? 'dark' : 'light';

  useEffect(() => {
    colorscheme.setColorScheme(themeMode);
  }, [themeMode, colorscheme]);

  return (
    <GluestackUIProvider mode={themeMode}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...AntDesign.font,
    ...FontAwesome5.font,
    ...MaterialCommunityIcons.font,
    ...MaterialIcons.font,
  });

  useEffect(() => {
    if (loaded) {
      setIsReady(true);
    }
  }, [loaded]);

  if (!isReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
