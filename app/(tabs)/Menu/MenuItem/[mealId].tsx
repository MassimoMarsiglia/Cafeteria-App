import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useLocalSearchParams } from "expo-router";
import { Card } from '@/components/ui/card';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';

export default function MealView() {
  const params = useLocalSearchParams<{ mealData: string; mealId: string }>();
  
  // Meal-Objekt aus JSON-String parsen
  const meal = params.mealData ? JSON.parse(params.mealData) : null;

  console.log('=== MEAL VIEW ===');
  console.log('Received meal:', meal?.name);

  if (!meal) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Fehler beim Laden der Mahlzeit</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      {/* Header Card */}
      <Card variant="elevated" className="p-4 mb-4">
        <Text className="text-2xl font-bold mb-2">{meal.name}</Text>
        <Text className="text-lg text-blue-600 mb-4">Kategorie: {meal.category}</Text>
      </Card>

      {/* Preise */}
      <Card variant="elevated" className="p-4 mb-4">
        <Text className="text-lg font-semibold mb-3">💰 Preise</Text>
        {meal.prices?.map((price: { priceType: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: number; }, index: Key | null | undefined) => (
          <View key={index} className="flex-row justify-between mb-2">
            <Text className="text-base">{price.priceType}:</Text>
            <Text className="text-base font-semibold">{price.price.toFixed(2)}€</Text>
          </View>
        ))}
      </Card>

      {/* Badges */}
      {meal.badges && meal.badges.length > 0 && (
        <Card variant="elevated" className="p-4 mb-4">
          <Text className="text-lg font-semibold mb-3">🏷️ Auszeichnungen</Text>
          {meal.badges.map((badge: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
            <View key={index} className="mb-3">
              <Text className="text-sm font-semibold">{badge.name}</Text>
              <Text className="text-xs text-gray-600">{badge.description}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* Umwelt-Informationen */}
      {(meal.co2Bilanz || meal.waterBilanz) && (
        <Card variant="elevated" className="p-4 mb-4">
          <Text className="text-lg font-semibold mb-3">🌍 Umwelt-Info</Text>
          {meal.co2Bilanz && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-base">CO₂-Bilanz:</Text>
              <Text className="text-base">{meal.co2Bilanz}g</Text>
            </View>
          )}
          {meal.waterBilanz && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-base">Wasserverbrauch:</Text>
              <Text className="text-base">{meal.waterBilanz}L</Text>
            </View>
          )}
        </Card>
      )}

      {/* Zusatzstoffe */}
      {meal.additives && meal.additives.length > 0 && (
        <Card variant="elevated" className="p-4 mb-4">
          <Text className="text-lg font-semibold mb-3">⚠️ Zusatzstoffe</Text>
          {meal.additives.map((additive: { referenceid: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; text: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
            <View key={index} className="mb-2">
              <Text className="text-sm">
                <Text className="font-semibold">{additive.referenceid}:</Text> {additive.text}
              </Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}