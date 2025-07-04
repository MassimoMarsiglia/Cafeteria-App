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
  /*
  "Student = 0, Angestellte = 1, Gäste = 2.
  TODO: Später durch die in Einstellungen gespeicherte Einstellung für Preise ersetzen. 
  */
  const preis_einstellung = [0,1,2]

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
            ? `${(meal.prices[preis_einstellung[0]]).price.toFixed(2)}€`
            : 'Kein Preis'}</Text> }
        {/* Category */}
        <Text>{meal.category}</Text>
      </Card>
    </TouchableOpacity>
  );
};
