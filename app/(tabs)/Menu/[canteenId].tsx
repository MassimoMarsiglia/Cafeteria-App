import { MealCard } from '@/components/Menu/MealCard/Index';
import { Text } from '@/components/ui/text';
import { useTodaysMenu } from '@/hooks/useMensaApi';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, RefreshControl, ScrollView } from 'react-native';
// import TopSection from './TopSection/Index';

const Menu = () => {
  const canteenId = useLocalSearchParams<{ canteenId: string }>();

  const {
    data: todaysMenu,
    loading: menuLoading,
    error: menuError,
    refetch: refetchMenu,
  } = useTodaysMenu(canteenId.canteenId);

  console.log('TodaysMenu (outside useEffect):', todaysMenu);

  // Handle error state
  if (menuError) {
    return (
      <Text style={{ color: 'red' }}>Error loading menu: {menuError}</Text>
    );
  }

  // Handle loading state
  if (menuLoading) {
    return <Text>Loading today menu...</Text>;
  }

  // Handle empty data state
  if (!todaysMenu || todaysMenu.length === 0) {
    return <Text>No menu available for today</Text>;
  }

  return (
    <ScrollView
      className="flex-1 px-4"
      refreshControl={
        <RefreshControl refreshing={menuLoading} onRefresh={refetchMenu} />
      }
    >
      {!menuLoading ? (
        <FlatList
          data={todaysMenu[0]?.meals || []}
          renderItem={MealCard}
          keyExtractor={(item, index) => `${item.ID}-${index}`}
          numColumns={2}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          columnWrapperClassName="justify-between px-2"
          className="py-2"
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

export default Menu;
