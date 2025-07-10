import { MealCard } from '@/components/Menu/MealCard/Index';
import { Text } from '@/components/ui/text';
import { useSettings } from '@/hooks/redux/useSettings';
import { useGetMenusQuery } from '@/services/mensaApi';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, ScrollView } from 'react-native';

const Menu = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);
  const canteenId = useLocalSearchParams<{ canteenId: string }>();
  const { priceCategory } = useSettings();

  const {
    data: menu,
    isLoading,
    isError,
    refetch,
  } = useGetMenusQuery({
    canteenId: canteenId.canteenId,
    startdate: date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    enddate: date.toISOString().split('T')[0], // Use the same date for single day menu
  });

  // console.log('TodaysMenu (outside useEffect):', menu);

  // Handle error state
  if (isError) {
    return <Text style={{ color: 'red' }}>Error loading menu: {isError}</Text>;
  }

  // Handle loading state
  if (isLoading) {
    return <Text>Loading today menu...</Text>;
  }

  // Handle empty data state
  if (!menu || menu.length === 0) {
    return <Text>No menu available for today</Text>;
  }

  // if (menu && menu[0]?.meals) {
  //   console.log('Meals array:', menu[0].meals);
  // }

  // const handleMealSelect = meal => {
  //   console.log('Selected meal id:', meal.id);
  //   console.log('Selected meal name:', meal.name);
  //   // For example, navigate to Chatbot and send this meal id/name,
  //   // or set it in state, or trigger API call here.
  // };

  return (
    <ScrollView
      className="flex-1 px-4 bg-background-0"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {/* <DateTimePicker
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
      /> */}
      {!isLoading ? (
        <FlatList
          data={menu[0]?.meals || []}
          renderItem={({ item, index }) => (
            <MealCard
              item={item}
              index={index}
              priceCategory={Number(priceCategory)}
              // onPress={() => handleMealSelect(item)}
            />
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
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
