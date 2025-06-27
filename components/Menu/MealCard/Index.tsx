import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Meal } from '@/services/mensaApi';
import { TouchableOpacity } from 'react-native';

export const MealCard = ({
  item: meal,
  index,
}: {
  item: Meal;
  index: number;
}) => {
  return (
    <TouchableOpacity className="flex-1 mx-2 last:flex">
      <Card variant="elevated" className="outline outline-1 p-4 mb-4 flex-1">
        {/* Meal name */}
        <Text className="font-roboto text-sm">{meal.name.trim()}</Text>
        {/* Price */}
        {/* <Text>{meal.prices ? `${meal.prices} €` : 'Preis nicht verfügbar'}</Text> */}
      </Card>
    </TouchableOpacity>
  );
};
