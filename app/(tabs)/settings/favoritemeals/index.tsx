import { MealCard } from '@/components/Menu/MealCard/Index';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useSettings } from '@/hooks/redux/useSettings';
import { FlatList } from 'react-native';

const FavoriteMeals = () => {
  const { favoriteMeals, priceCategory } = useSettings();

  if (favoriteMeals.length === 0) {
    return (
      <View className="mb-4 mt-4 px-4 bg-background-0 h-full">
        <Text className="text-2xl font-bold mb-4">Lieblingsgerichte</Text>
        <Text className="text-lg text-gray-500">
          Du hast noch keine Lieblingsgerichte ausgewählt.
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-4 mt-4 px-4 bg-background-0 h-full">
      <Text className="text-2xl font-bold mb-4">Lieblingsgerichte</Text>
      <FlatList
        data={favoriteMeals}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <MealCard
            item={item}
            index={index}
            priceCategory={Number(priceCategory)}
          />
        )}
      />
    </View>
  );
};

export default FavoriteMeals;
