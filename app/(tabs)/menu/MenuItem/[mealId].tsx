import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useSettings } from '@/hooks/redux/useSettings';
import { useGetMealsQuery } from '@/services/mensaApi';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export default function MealView() {
  const params = useLocalSearchParams<{ mealId: string }>();
  const { favoriteMeals, addFavoriteMeals, removeFavoriteMeals } =
    useSettings();
  const { data: mealData } = useGetMealsQuery({
    ID: params.mealId,
    loadingtype: 'complete',
  });
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.mealId) {
      setIsFavorite(favoriteMeals.some(m => m.id === params.mealId));
    }
  }, [params.mealId, favoriteMeals]);

  if (!mealData || mealData.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Fehler beim Laden der Mahlzeit</Text>
      </View>
    );
  }

  const meal = mealData[0];

  const handleFavoritePress = () => {
    if (isFavorite) {
      removeFavoriteMeals(meal);
    } else {
      addFavoriteMeals(meal);
    }
  };

  const handleRecipePress = () => {
    router.navigate({
      pathname: '/chatbot/[mealId]',
      params: {
        mealId: meal.id,
        mealName: meal.name,
      },
    });
  };

  const formatBadgeName = (badgeName: string) => {
    // Entferne Unterstriche und ersetze sie durch Leerzeichen
    let formatted = badgeName.replace(/_/g, ' ');

    // Entferne "_A" am Ende (case-insensitive)
    formatted = formatted.replace(/\s*A$/i, '');

    return formatted;
  };

  // Filtere CO2 und H2O Bewertungen für Umwelt-Info
  const environmentBadges =
    meal.badges?.filter(
      (badge: any) =>
        badge.name.toLowerCase().includes('co2') ||
        badge.name.toLowerCase().includes('h2o'),
    ) || [];

  // Filtere andere Badges für Generelle-Infos
  const generalBadges =
    meal.badges?.filter(
      (badge: any) =>
        !badge.name.toLowerCase().includes('co2') &&
        !badge.name.toLowerCase().includes('h2o'),
    ) || [];

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 p-4">
        {/* Header Card */}
        <Card variant="elevated" className="p-4 mb-4">
          <Text className="text-2xl font-bold mb-2">{meal.name}</Text>
          <Text className="text-lg mb-4">Kategorie: {meal.category}</Text>
        </Card>

        {/* Preise */}
        <Card variant="elevated" className="p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="cash"
              size={30}
              color="#FBC02D"
              style={{ marginRight: 8 }}
            />
            <Text className="text-lg font-semibold">Preise</Text>
          </View>
          {meal.prices?.map((price: any, index: number) => (
            <View key={index} className="flex-row justify-between mb-2">
              <Text className="text-base">{price.priceType}:</Text>
              <Text className="text-base font-semibold">
                {price.price.toFixed(2)}€
              </Text>
            </View>
          ))}
        </Card>

        {/* Generelle-Infos */}
        {generalBadges && generalBadges.length > 0 && (
          <Card variant="elevated" className="p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="information-circle"
                size={30}
                color="#1565C0"
                style={{ marginRight: 8 }}
              />
              <Text className="text-lg font-semibold">Generelle-Infos</Text>
            </View>
            {generalBadges.map((badge: any, index: number) => (
              <View key={index} className="mb-3">
                <Text className="text-sm font-semibold">
                  {formatBadgeName(badge.name)}
                </Text>
                <Text className="text-xs text-gray-600">
                  {badge.description}
                </Text>
              </View>
            ))}
          </Card>
        )}

        <Accordion
          type="multiple"
          className="mb-4 rounded-lg overflow-hidden border-none"
        >
          {/* Umwelt-Informationen */}
          {(meal.co2Bilanz ||
            meal.waterBilanz ||
            environmentBadges.length > 0) && (
            <AccordionItem value="environment">
              <AccordionHeader>
                <AccordionTrigger>
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name="leaf"
                      size={30}
                      color="#43A047"
                      style={{ marginRight: 8 }}
                    />
                    <AccordionTitleText>Umwelt-Info</AccordionTitleText>
                  </View>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                {environmentBadges.map((badge: any, index: number) => (
                  <View key={index} className="mb-3">
                    <Text className="text-sm font-semibold">
                      {formatBadgeName(badge.name)}
                    </Text>
                    <Text className="text-xs text-gray-600">
                      {badge.description}
                    </Text>
                    {badge.name.toLowerCase().includes('co2') &&
                      meal.co2Bilanz && (
                        <Text className="text-xs text-gray-500 mt-1">
                          CO₂-Bilanz: {meal.co2Bilanz}g
                        </Text>
                      )}
                    {badge.name.toLowerCase().includes('h2o') &&
                      meal.waterBilanz && (
                        <Text className="text-xs text-gray-500 mt-1">
                          Wasserverbrauch: {meal.waterBilanz}L
                        </Text>
                      )}
                  </View>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Zusatzstoffe */}
          {meal.additives && meal.additives.length > 0 && (
            <AccordionItem value="additives">
              <AccordionHeader>
                <AccordionTrigger>
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name="warning"
                      size={30}
                      color="#FFEE58"
                      style={{ marginRight: 8 }}
                    />
                    <AccordionTitleText>Allergene</AccordionTitleText>
                  </View>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                {meal.additives.map((additive: any, index: number) => (
                  <View key={index} className="mb-2">
                    <Text className="text-sm">
                      <Text className="font-semibold">
                        {additive.referenceid}:
                      </Text>{' '}
                      {additive.text}
                    </Text>
                  </View>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Zusätzlicher Platz für FAB-Buttons */}
        <View className="h-20" />
      </ScrollView>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-6 left-6">
        <Button
          size="lg"
          className="rounded-full shadow-lg w-20 h-20 p-0 items-center justify-center"
          onPress={handleRecipePress}
        >
          <Ionicons name="sparkles" size={34} color="#FBC02D" />
        </Button>
      </View>

      <View className="absolute bottom-6 right-6">
        <Button
          size="lg"
          className="rounded-full shadow-lg w-20 h-20 p-0 items-center justify-center"
          onPress={handleFavoritePress}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={40}
            color={isFavorite ? '#FF6B6B' : '#999'}
          />
        </Button>
      </View>
    </View>
  );
}
