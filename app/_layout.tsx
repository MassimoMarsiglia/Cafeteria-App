import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { chatdb } from '@/database/chatdatabase';
import migrations from '@/drizzle/migrations';
import { useSettings } from '@/hooks/redux/useSettings';
import { AntDesign } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../store';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

// Create a wrapper component that has access to Redux
function AppContent() {
  const { success, error } = useMigrations(chatdb, migrations);
  const { isDarkMode } = useSettings();
  const colorscheme = useColorScheme();

  const themeMode = isDarkMode ? 'dark' : 'light';

  useEffect(() => {
    if (!success) return;
    colorscheme.setColorScheme(themeMode);
  }, [themeMode, colorscheme, success]);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

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
