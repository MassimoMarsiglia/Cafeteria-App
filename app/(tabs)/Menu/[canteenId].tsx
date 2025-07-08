import { MealCard } from '@/components/Menu/MealCard/Index';
import { Text } from '@/components/ui/text';
import { Fab, FabIcon } from '@/components/ui/fab';
import { CalendarDaysIcon } from '@/components/ui/icon';
import { useSettings } from '@/hooks/redux/useSettings';
import { useGetMenusQuery } from '@/services/mensaApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';

const Menu = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
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

  console.log('TodaysMenu (outside useEffect):', menu);

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

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || date;
              setShow(false);
              setDate(currentDate);
              // refetchMenu(currentDate);
            }}
            style={{ width: '100%' }}
          />
        )}
        {!isLoading ? (
          <FlatList
            data={menu[0]?.meals || []}
            renderItem={({ item, index }) => (
              <MealCard
                item={item}
                index={index}
                priceCategory={Number(priceCategory)}
              />
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
      <Fab
        size="lg"
        placement="bottom right"
        onPress={() => setShow(true)}
      >
        <FabIcon as={CalendarDaysIcon} />
      </Fab>
    </View>
  );
};

export default Menu;
