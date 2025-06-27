import { Meal } from '@/services/mensaApi';
import { TouchableOpacity } from 'react-native';
import { Card } from '../ui/card';
import { Text } from '../ui/text';

export const MealCard = ({
  item: meal,
  index,
}: {
  item: Meal;
  index: number;
}) => {
  return (
    <TouchableOpacity>
      <Card variant="elevated" className="bg-background-100 p-4 mb-4">
        {/* Meal name */}
        <Text>{meal.name}</Text>
        {/* Price */}
        {/* <Text>{meal.prices ? `${meal.prices} €` : 'Preis nicht verfügbar'}</Text> */}
      </Card>
    </TouchableOpacity>
  );
};
