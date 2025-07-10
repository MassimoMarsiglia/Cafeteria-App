import { MealCard } from '@/components/Menu/MealCard/Index';
import { Text } from '@/components/ui/text';
import { Fab, FabIcon } from '@/components/ui/fab';
import { CalendarDaysIcon } from '@/components/ui/icon';
import { useSettings } from '@/hooks/redux/useSettings';
import { useGetMenusQuery } from '@/services/mensaApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const Menu = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const canteenId = useLocalSearchParams<{ canteenId: string }>();
  const { priceCategory } = useSettings();
  const flatListRef = useRef<FlatList>(null);
  const tabScrollRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');

  const {
    data: menu,
    isLoading,
    isError,
    refetch,
  } = useGetMenusQuery({
    canteenId: canteenId.canteenId,
    startdate: date.toISOString().split('T')[0],
    enddate: date.toISOString().split('T')[0],
  });

  // Gerichte nach Kategorien gruppieren
  const groupedMeals = (menu?.[0]?.meals || []).reduce(
    (acc, meal) => {
      const category = meal.category || 'Sonstiges';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(meal);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Kategorien sortieren - Hauptgerichte zuerst
  const sortedCategories = Object.keys(groupedMeals).sort((a, b) => {
    if (a.toLowerCase().includes('essen') || a.toLowerCase().includes('haupt'))
      return -1;
    if (b.toLowerCase().includes('essen') || b.toLowerCase().includes('haupt'))
      return 1;
    return a.localeCompare(b);
  });

  // Daten für FlatList vorbereiten
  const categoriesData = sortedCategories.map(category => ({
    category,
    meals: groupedMeals[category],
  }));

  const handleCategoryPress = (index: number) => {
    setActiveCategory(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });

    // Tab automatisch in den sichtbaren Bereich scrollen
    const tabWidth = 120; // Geschätzte Breite eines Tabs
    const scrollPosition = index * tabWidth - width / 2 + tabWidth / 2;
    tabScrollRef.current?.scrollTo({
      x: Math.max(0, scrollPosition),
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    if (currentIndex !== activeCategory) {
      setActiveCategory(currentIndex);

      // Tab automatisch in den sichtbaren Bereich scrollen
      const tabWidth = 120; // Geschätzte Breite eines Tabs
      const scrollPosition = currentIndex * tabWidth - width / 2 + tabWidth / 2;
      tabScrollRef.current?.scrollTo({
        x: Math.max(0, scrollPosition),
        animated: true,
      });
    }
  };

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
    <View className="flex-1 bg-background-0">
      {/* DateTimePicker außerhalb */}
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShow(false);
            setDate(currentDate);
          }}
          className="w-full"
        />
      )}

      {/* Kategorie-Tabs */}
      <View className="mb-4 mt-4 px-4">
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-12"
        >
          <View className="flex-row px-2">
            {sortedCategories.map((category, index) => (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategoryPress(index)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  activeCategory === index ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    activeCategory === index ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {category} ({groupedMeals[category].length})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Swipeable Content */}
        {!isLoading ? (
          <FlatList
            ref={flatListRef}
            data={categoriesData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            keyExtractor={item => item.category}
            renderItem={({ item }) => (
              <View style={{ width: width - 32 }}>
                <FlatList
                  data={item.meals}
                  renderItem={({ item: meal, index }) => (
                    <MealCard
                      item={meal}
                      index={index}
                      priceCategory={Number(priceCategory)}
                    />
                  )}
                  keyExtractor={(meal, index) => `${meal.ID}-${index}`}
                  numColumns={1}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  className="py-2"
                />
              </View>
            )}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>

      <Fab size="lg" placement="bottom right" onPress={() => setShow(true)}>
        <FabIcon as={CalendarDaysIcon} />
      </Fab>
    </View>
  );
};

export default Menu;
