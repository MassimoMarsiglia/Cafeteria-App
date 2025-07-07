import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSettings } from '@/hooks/redux/useSettings';
import { Meal } from '@/services/mensaTypes';
import { TouchableOpacity, Image } from 'react-native';

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

  return (
    <TouchableOpacity className="flex-1 mx-2 last:flex">
      <Card variant="elevated" className="outline outline-1 p-2 mb-4 flex-1">
        <Image
          source={getCategoryImage(meal.category)}
          style={{
            height: 100,
            width: '100%',
            marginBottom: 8,
            borderRadius: 8,
          }} // Tailwind hat nicht funktioniert
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
