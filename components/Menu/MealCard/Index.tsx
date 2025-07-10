import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Meal } from '@/services/mensaTypes';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

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
    <TouchableOpacity className="flex-1 mx-2 last:flex" onPress={routeToItem}>
      <Card variant="elevated" className="outline outline-1 p-2 mb-4 flex-1">
        <Image
          source={require('@/assets/categorys/essen.png')}
          className="w-full h-48 mb-2 rounded-lg"
          alt="image"
        />
        {/* Meal name */}
        <Text className="font-roboto" numberOfLines={2} ellipsizeMode="tail">
          {meal.name.trim()}
        </Text>
        <Text className="font-roboto" numberOfLines={2} ellipsizeMode="tail">
          {meal.name.trim()}
        </Text>
        {/* Price */}
        {
          <Text>
            {meal.prices && meal.prices.length > 0
              ? `${meal.prices[Number(priceCategory)].price.toFixed(2)}€`
              : 'Kein Preis'}
          </Text>
        }
        {
          <Text>
            {meal.prices && meal.prices.length > 0
              ? `${meal.prices[Number(priceCategory)].price.toFixed(2)}€`
              : 'Kein Preis'}
          </Text>
        }
        {/* Category */}
        <Text>{meal.category}</Text>
      </Card>
    </TouchableOpacity>
  );
};
