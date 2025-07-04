import { MealCard } from '@/components/Menu/MealCard/Index';
import { Text } from '@/components/ui/text';
import { useSettings } from '@/hooks/redux/useSettings';
import { useTodaysMenu } from '@/hooks/useMensaApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, ScrollView } from 'react-native';
// import TopSection from './TopSection/Index';

const Menu = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const canteenId = useLocalSearchParams<{ canteenId: string }>();
  const { priceCategory } = useSettings();

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
      <DateTimePicker
        value={date}
        mode="date"
        display="calendar"
        onChange={(event, selectedDate) => {
          const currentDate = selectedDate || date;
          setShow(false);
          setDate(currentDate);
          // Optionally, you can refetch the menu for the selected date here
          // refetchMenu(currentDate);
        }}
        style={{ width: '100%' }}
      />
      {!menuLoading ? (
        <FlatList
          data={todaysMenu[0]?.meals || []}
          renderItem={({ item, index }) => (
            <MealCard item={item} index={index} priceCategory={Number(priceCategory)} />
          )}
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
