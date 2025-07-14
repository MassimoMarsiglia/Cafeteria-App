import { MealCard } from '@/components/Menu/MealCard/Index';
import { Fab, FabIcon } from '@/components/ui/fab';
import { CalendarDaysIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSettings } from '@/hooks/redux/useSettings';
import { useGetMenusQuery } from '@/services/mensaApi';
import { useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';

const Menu = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
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
    startdate: (date || new Date()).toISOString().split('T')[0],
    enddate: (date || new Date()).toISOString().split('T')[0],
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

  const onDismiss = () => {
    setShow(false);
  };

  const onConfirm = ({ date }: { date: Date | undefined }) => {
    setShow(false);
    setDate(date);
  };

  // Handle error state
  if (isError) {
    return <Text style={{ color: 'red' }}>Error loading menu: {isError}</Text>;
  }

  // Handle loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-0">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg">Loading menu...</Text>
      </View>
    );
  }

  // Handle empty data state
  if (!menu || menu.length === 0) {
    return <Text>No menu available for today</Text>;
  }

  return (
    <PaperProvider>
      <View className="flex-1 bg-background-0">
        {/* DatePicker außerhalb */}
        <DatePickerModal
          locale="de"
          mode="single"
          visible={show}
          onDismiss={onDismiss}
          date={date}
          onConfirm={onConfirm}
          label="Datum auswählen"
          saveLabel="Bestätigen"
          startWeekOnMonday
          presentationStyle='pageSheet'
        />

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
          className="flex-1"
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
                <View className="px-4" style={{ width: width }}>
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

        <Fab
          size="lg"
          placement="bottom right"
          onPress={() => {
            console.log('Fab clicked!');
            setShow(true);
          }}
        >
          <FabIcon as={CalendarDaysIcon} />
        </Fab>
      </View>
    </PaperProvider>
  );
};

export default Menu;
