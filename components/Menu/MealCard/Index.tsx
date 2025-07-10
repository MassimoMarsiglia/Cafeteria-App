import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Meal } from '@/services/mensaTypes';
import { useRouter } from 'expo-router';
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

  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/chatbot/[mealId]',
      params: {
        mealId: meal.id,
        mealName: meal.name,
      },
    });
  };

  return (
    <TouchableOpacity className="mx-2 mb-4" onPress={handlePress}>
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
