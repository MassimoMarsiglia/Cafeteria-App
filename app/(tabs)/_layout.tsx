import { useSettings } from '@/hooks/redux/useSettings';
import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const { isDarkMode } = useSettings();

  const backgroundColor = isDarkMode ? '#18181b' : '#ffffff';

  const defaultScreenOptions = {
    headerShown: false,
    gestureEnabled: true,
    contentStyle: { backgroundColor },
    cardStyle: { backgroundColor },
  } as const;

  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Dishes',
        }}
      />
      <Stack.Screen
        name="menu/[canteenId]"
        options={{
          title: 'Menu',
        }}
      />
      <Stack.Screen
        name="mensen/mensenList"
        options={{
          title: 'Mensen List',
        }}
      />
      <Stack.Screen
        name="mensen/mensenDetail/[canteenId]"
        options={{
          title: 'Menu',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings Screen',
        }}
      />
      <Stack.Screen
        name="chatbot/[mealId]"
        options={{
          title: 'Chat Bot',
        }}
      />
      <Stack.Screen
        name="chatbot/MealListScreen"
        options={{
          title: 'Chat Bot Saved List',
        }}
      />
      <Stack.Screen
        name="settings/pricecategory"
        options={{
          title: 'Price Category Settings',
        }}
      />
    </Stack>
  );
}
