import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { useSettings } from '@/hooks/redux/useSettings';
import { Meal } from '@/services/mensaTypes';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export const MealCard = ({
  item: meal,
  index,
  priceCategory,
  onPress,
}: {
  item: Meal;
  index: number;
  priceCategory: number;
  onPress?: () => void;
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

  const { favoriteMeals } = useSettings();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (meal.id) {
      setIsFavorite(favoriteMeals.filter(m => m.id === meal.id).length > 0);
    }
  }, [meal.id, favoriteMeals]);

  const routeToItem = () => {
    router.push({
      pathname: '/menu/MenuItem/[mealId]',
      params: {
        mealData: JSON.stringify(meal),
        mealId: meal.id,
      },
    });
  };

  return (
    <TouchableOpacity className="w-full mb-4" onPress={routeToItem}>
      <Card
        variant="elevated"
        className={`p-4 flex-row items-center bg-secondary-100 rounded-lg shadow-md border-2 ${
          isFavorite ? 'border-yellow-400' : 'border-secondary-500'
        }`}
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
          <Text className="text-sm text-primary-100">{meal.category}</Text>
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
