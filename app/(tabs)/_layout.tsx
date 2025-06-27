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
        name="all_cafeterias"
        options={{
          title: 'All Cafeterias',
        }}
      />
      <Stack.Screen
        name="Menu/[canteenId]"
        options={{
          title: 'Menu',
        }}
      />
    </Stack>
  );
}
