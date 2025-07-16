import { Navbar } from '@/components/Navbar/Index';
import { useSettings } from '@/hooks/redux/useSettings';
import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const { isDarkMode } = useSettings();

  const backgroundColor = isDarkMode ? '#18181b' : '#ffffff';

  const defaultScreenOptions = () => ({
    headerShown: true,
    header: () => <Navbar />,
    gestureEnabled: true,
    contentStyle: { backgroundColor },
    cardStyle: { backgroundColor },
  });

  return (
    <Stack screenOptions={defaultScreenOptions}>
      <Stack.Screen name="index" />
      <Stack.Screen name="menu/[canteenId]" />
      <Stack.Screen name="mensen/mensenList" />
      <Stack.Screen name="mensen/mensenDetail/[canteenId]" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="chatbot/[mealId]" />
      <Stack.Screen name="chatbot/MealListScreen" />
      <Stack.Screen name="settings/favoritemeals" />
      <Stack.Screen name="settings/pricecategory" />
    </Stack>
  );
}
