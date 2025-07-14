import { MealCard } from '@/components/Menu/MealCard/Index';
import { Fab, FabIcon } from '@/components/ui/fab';
import { CalendarDaysIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSettings } from '@/hooks/redux/useSettings';
import { useGetMenusQuery } from '@/services/mensaApi';
import AntDesign from '@expo/vector-icons/AntDesign';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Menu = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const canteenId = useLocalSearchParams<{ canteenId: string }>();
  const { priceCategory, favoriteMeals } = useSettings();
  const flatListRef = useRef<FlatList>(null);
  const tabScrollRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');

  const {
    data: menu,
    isLoading,
    isFetching,
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
      if (meal.id && favoriteMeals.filter(m => m.id === meal.id).length > 0) {
        if (!acc['Lieblingsgerichte']) {
          acc['Lieblingsgerichte'] = [];
        }
        acc['Lieblingsgerichte'].push(meal);
      }
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Kategorien sortieren - Hauptgerichte zuerst, Lieblingsgerichte zuletzt
  const sortedCategories = Object.keys(groupedMeals).sort((a, b) => {
    // Lieblingsgerichte immer zuletzt
    if (a === 'Lieblingsgerichte') return 1;
    if (b === 'Lieblingsgerichte') return -1;

    // Hauptgerichte zuerst
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

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setShow(false);
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sonntag (0) oder Samstag (6)
  };

  // Content je nach Zustand bestimmen
  const renderContent = () => {
    if (isLoading || isFetching) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 justify-center items-center">
          <AntDesign name="wifi" size={75} color="grey" className="mb-6" />
          <Text className="text-base font-medium mb-4">
            Fehler beim Laden des Menüs
          </Text>
          <Text className="text-base font-small mb-4">
            Überprüfe deine Internetverbindung
          </Text>
        </View>
      );
    }

    if (!menu || menu.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <AntDesign
            name="infocirlceo"
            size={75}
            color="gray"
            className="mb-6"
          />
          <Text className="text-base font-medium mb-4">
            Es gibt noch kein Menü für den {date.toLocaleDateString('de-DE')}
          </Text>
          <Text className="text-base font-small mb-4">
            Wählen Sie ein anderes Datum aus
          </Text>
        </View>
      );
    }

    if (!menu[0]?.meals || menu[0].meals.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <AntDesign name="frowno" size={75} color="gray" className="mb-6" />
          <Text className="text-base font-medium mb-4">
            {isWeekend(date)
              ? 'Am Wochenende ist die Mensa geschlossen'
              : `Keine Gerichte verfügbar für den ${date.toLocaleDateString('de-DE')}`}
          </Text>
          <Text className="text-base font-small mb-4">
            {isWeekend(date)
              ? 'Wählen Sie einen Werktag aus'
              : 'Wählen Sie ein anderes Datum aus'}
          </Text>
        </View>
      );
    }

    // Normal menu display
    return (
      <>
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
        </ScrollView>
      </>
    );
  };

  return (
    <View className="flex-1 bg-background-0">
      {/* React Native Modal DateTime Picker */}
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        date={date}
        onConfirm={handleConfirm}
        onCancel={() => setShow(false)}
        locale="de_DE"
        cancelTextIOS="Abbrechen"
        confirmTextIOS="Ok"
      />

      {/* Dynamic Content */}
      {renderContent()}

      {/* Fab mit Icon */}
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
  );
};

export default Menu;
