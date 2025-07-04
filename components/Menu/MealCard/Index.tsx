import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSettings } from '@/hooks/redux/useSettings';
import { Meal } from '@/services/mensaApi';
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
    <TouchableOpacity className="flex-1 mx-2 last:flex">
      <Card variant="elevated" className="outline outline-1 p-4 mb-4 flex-1">
        {/* Meal name */}
        <Text className="font-roboto text-sm"
        numberOfLines={2}
        ellipsizeMode="tail">
        {meal.name.trim()}</Text>
        {/* Price */}
        {<Text>{meal.prices && meal.prices.length > 0
            ? `${(meal.prices[Number(priceCategory)]).price.toFixed(2)}€`
            : 'Kein Preis'}</Text> }
        {/* Category */}
        <Text>{meal.category}</Text>
      </Card>
    </TouchableOpacity>
  );
};
