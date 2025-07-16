import { Chat } from '@/database/schema';
import { getAllChats } from '@/repository/chatRepository';
import { useChatBotService } from '@/services/chatBotService';
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
  const [meals, setMeals] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { deleteChat } = useChatBotService();

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = () => {
    setLoading(true);
    getAllChats()
      .then(setMeals)
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  };

  const handleSelectMeal = (meal: Chat) => {
    router.navigate({
      pathname: '/(tabs)/chatbot/[mealId]',
      params: { mealId: meal.id },
    });
  };

  const handleDeleteMeal = (meal: Chat) => {
    Alert.alert(
      'Meal löschen',
      `Möchtest du „${meal.name}“ wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'default',
          onPress: () => {
            deleteChat(meal.id)
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

  const toggleMenu = (meal: Chat) => {
    setExpandedId(expandedId === meal.id ? null : meal.id);
  };

  if (loading) return <Text className="text-center mt-8">Loading...</Text>;

  if (meals.length === 0) {
    return (
      <Text className="text-center mt-8 text-gray-500 dark:text-gray-400">
        Keine gespeicherten Gerichte gefunden!
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
        className={`flex-1 p-4 ${
          colorScheme === 'dark' ? 'bg-black' : 'bg-gray-100'
        }`}
      >
        <FlatList
          data={meals}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View className="mb-3">
              <View
                className={`flex-row justify-between items-center rounded-lg p-4 ${
                  colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-md`}
              >
                {/* Accent Strip */}
                <View
                  className={`w-2 h-full rounded-l-xl mr-3 ${cardColors[index % cardColors.length]}`}
                />

                <TouchableOpacity
                  className="flex-1"
                  onPress={() => handleSelectMeal(item)}
                >
                  <Text
                    className={`text-lg ${
                      colorScheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {item.name}
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
              {expandedId === item.id && (
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
