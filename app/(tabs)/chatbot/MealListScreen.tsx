import { Chat } from '@/database/schema';
import { getAllChats } from '@/repository/chatRepository';
import { useChatBotService } from '@/services/chatBotService';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
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
      'Delete Meal',
      `Are you sure you want to delete "${meal}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
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
        No saved meals found.
      </Text>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 p-4 ${
        colorScheme === 'dark' ? 'bg-black' : 'bg-gray-100'
      }`}
    >
      <FlatList
        data={meals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="mb-3">
            <View
              className={`flex-row justify-between items-center rounded-lg p-4 ${
                colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-md`}
            >
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

              <TouchableOpacity
                onPress={() => toggleMenu(item)}
                className={`px-2 py-1 rounded ${
                  colorScheme === 'dark'
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-200'
                }`}
              >
                <Text
                  className={`text-xl font-bold ${
                    colorScheme === 'dark' ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  ...
                </Text>
              </TouchableOpacity>
            </View>

            {/* Delete option below the meal row */}
            {expandedId === item.id && (
              <TouchableOpacity
                onPress={() => {
                  toggleMenu(item);
                  handleDeleteMeal(item);
                }}
                className={`mt-1 rounded px-4 py-2 ${
                  colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              >
                <Text
                  className={`text-center text-sm font-medium ${
                    colorScheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default MealListScreen;
