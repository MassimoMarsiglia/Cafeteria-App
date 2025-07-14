import { getSavedMeals } from '@/utils/database';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity } from 'react-native';

type Props = {
  navigation: any; // adjust for your navigation type
};

const MealListScreen: React.FC<Props> = ({ navigation }) => {
  const [meals, setMeals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSavedMeals()
      .then(setMeals)
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectMeal = (meal: string) => {
    router.navigate({
      pathname: '/(tabs)/chatbot/[mealId]',
      params: { mealName: meal },
    });
  };

  if (loading) return <Text>Loading...</Text>;

  if (meals.length === 0) {
    return <Text>No saved meals found.</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={meals}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 16,
              marginVertical: 8,
              backgroundColor: '#3498db',
              borderRadius: 8,
            }}
            onPress={() => handleSelectMeal(item)}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default MealListScreen;
