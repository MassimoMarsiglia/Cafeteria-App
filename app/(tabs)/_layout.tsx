import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
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
      <Stack screenOptions={{ gestureEnabled: true }} />;
    </Stack>
  );
}
