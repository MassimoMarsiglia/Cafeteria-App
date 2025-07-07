import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Meal } from '@/services/mensaTypes';
import { TouchableOpacity } from 'react-native';

export const MealCard = ({
  item: meal,
  index,
  priceCategory,
}: {
  item: Meal;
  index: number;
  priceCategory: number;
}) => {

  return (
    <TouchableOpacity className="mx-2 mb-4">
      <Card variant="elevated" className="outline outline-1 p-2">
        <Image
          source={require('@/assets/categorys/essen.png')}
          className="w-full h-48 mb-2 rounded-lg"
          alt="image"
        />
        {/* Meal name */}
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
        {/* Category */}
        <Text>{meal.category}</Text>
      </Card>
    </TouchableOpacity>
  );
};
