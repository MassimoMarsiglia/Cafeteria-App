import { deleteMeal, getSavedMeals } from '@/utils/database';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';

type Props = {
  navigation: any;
};

const MealListScreen: React.FC<Props> = ({ navigation }) => {
  const [meals, setMeals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = () => {
    setLoading(true);
    getSavedMeals()
      .then(setMeals)
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  };

  const handleSelectMeal = (meal: string) => {
    router.navigate({
      pathname: '/(tabs)/chatbot/[mealId]',
      params: { mealName: meal },
    });
  };

  const handleDeleteMeal = (meal: string) => {
    Alert.alert(
      'Delete Meal',
      `Are you sure you want to delete "${meal}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'default',
          onPress: () => {
            deleteMeal(meal)
              .then(() => fetchMeals())
              .catch(() => {
                Alert.alert('Error', 'Failed to delete the meal.');
              });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const toggleMenu = (meal: string) => {
    setExpandedId(expandedId === meal ? null : meal);
  };

  if (loading) return <Text className="text-center mt-8">Loading...</Text>;

  if (meals.length === 0) {
    return (
      <Text className="text-center mt-8 text-gray-500 dark:text-gray-400">
        No saved meals found.
      </Text>
    );
  }

  const cardColors = [
    'bg-teal-500 dark:bg-teal-600',
    'bg-indigo-500 dark:bg-indigo-600',
    'bg-pink-500 dark:bg-pink-600',
    'bg-amber-400 dark:bg-amber-500',
    'bg-sky-500 dark:bg-sky-600',
  ];

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // Close delete menu if open
        if (expandedId !== null) {
          setExpandedId(null);
        }
        // Also dismiss keyboard if needed
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView
        className={`flex-1 p-4 ${colorScheme === 'dark' ? 'bg-bg-background' : 'bg-background'}`}
      >
        <FlatList
          data={meals}
          keyExtractor={item => item}
          renderItem={({ item, index }) => (
            <View className="mb-3 relative" style={{ overflow: 'visible' }}>
              <View
                className={`flex-row items-center rounded-xl p-4 shadow-md shadow-black/10 ${
                  colorScheme === 'dark' ? 'bg-black' : 'bg-white'
                }`}
              >
                {/* Accent Strip */}
                <View
                  className={`w-2 h-full rounded-l-xl mr-3 ${cardColors[index % cardColors.length]}`}
                />

                {/* Meal Text */}
                <TouchableOpacity
                  className="flex-1"
                  onPress={() => handleSelectMeal(item)}
                >
                  <Text className="text-base font-medium text-black dark:text-white">
                    {item}
                  </Text>
                </TouchableOpacity>

                {/* Menu Toggle Button */}
                <TouchableOpacity
                  onPress={() => toggleMenu(item)}
                  className={`px-2 py-1 rounded ${
                    colorScheme === 'dark'
                      ? 'hover:bg-black-800'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <Text className="text-xl font-bold text-black dark:text-white">
                    ...
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Delete section */}
              {expandedId === item && (
                <View
                  className={`mt-2 rounded-lg px-3 py-2 flex-row items-center justify-end shadow-xl ${
                    colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                  style={{ alignSelf: 'flex-end' }} // shrink width to content, align right
                >
                  <TouchableOpacity
                    onPress={() => {
                      toggleMenu(item);
                      handleDeleteMeal(item);
                    }}
                    className="flex-row items-center space-x-1"
                  >
                    <Text
                      className={`text-lg font-semibold ${
                        colorScheme === 'dark' ? 'text-red-300' : 'text-red-600'
                      }`}
                    >
                      🗑️ Löschen
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default MealListScreen;
