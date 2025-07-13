import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Meal } from '@/services/mensaTypes';
import { TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

export const MealCard = ({
  item: meal,
  index,
  priceCategory,
}: {
  item: Meal;
  index: number;
  priceCategory: number;
}) => {
  //Bildauswahl für Card // Salate Suppen Aktionen Essen Beilagen Desserts
  const getCategoryImage = (category: string | undefined) => {
    switch ((category ?? '').toLowerCase()) {
      case 'essen':
        return require('@/assets/categorys/essen.png');
      case 'beilagen':
        return require('@/assets/categorys/beilagen.png');
      case 'salate':
        return require('@/assets/categorys/salate.png');
      case 'suppen':
        return require('@/assets/categorys/suppen.png');
      case 'desserts':
        return require('@/assets/categorys/desserts.png');
      default:
        return require('@/assets/categorys/default.png'); // Fallback-Bild
    }
  };

  const routeToItem = () => {
    router.push({
      pathname: '/menu/MenuItem/[mealId]',
      params: { 
        mealData: JSON.stringify(meal),
        mealId: meal.id,
      },
    }); 
  }

  return (
    <TouchableOpacity className="w-full mb-4" onPress={routeToItem}>
      <Card
        variant="elevated"
        className="outline outline-1 p-4 flex-row items-center bg-secondary-500 rounded-lg"
      >
        {/* Text Content - Links */}
        <View className="flex-1 pr-4">
          {/* Meal name */}
          <Text 
            className="font-roboto text-lg font-semibold mb-2"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {meal.name.trim()}
          </Text>
          {/* Price */}
          <Text className="text-base font-medium mb-1">
            {meal.prices && meal.prices.length > 0
              ? `${meal.prices[Number(priceCategory)].price.toFixed(2)}€`
              : 'Kein Preis'}
          </Text>
          {/* Category */}
          <Text className="text-sm text-gray-600">{meal.category}</Text>
        </View>

        {/* Image - Rechts */}
        <Image
          source={getCategoryImage(meal.category)}
          className="h-20 w-20 rounded-lg"
          alt="image"
        />
      </Card>
    </TouchableOpacity>
  );
};
