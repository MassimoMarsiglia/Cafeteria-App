import { ErrorState } from '@/components/ErrorView';
import { FavoriteFab } from '@/components/FavoriteFab';
import { GenerateFab } from '@/components/Menu/GenerateFab';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useSettings } from '@/hooks/redux/useSettings';
import { useGetMealsQuery } from '@/services/mensaApi';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Dimensions } from 'react-native';

export default function MealView() {
  const params = useLocalSearchParams<{ mealId: string }>();
  const { favoriteMeals, addFavoriteMeals, removeFavoriteMeals } =
    useSettings();
  const {
    data: mealData,
    isLoading,
    isError,
    refetch,
  } = useGetMealsQuery({
    ID: params.mealId,
    loadingtype: 'complete',
  });

  const { height } = Dimensions.get('window');

  const isFavorite = favoriteMeals.some(meal => meal.id === params.mealId);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorState
        icon="wifi"
        title="Das Gericht konnte nicht geladen werden."
        description="Es hat sich ausgeschmaust. Überprüfe deine Internetverbindung."
        onRefresh={refetch}
        isRefreshing={isLoading}
        minHeight={height - 150}
      />
    );
  }

  if (!mealData || mealData.length === 0) {
    return (
      <ErrorState
        icon="closecircleo"
        title="Mahlzeit nicht gefunden"
        description="Diese Mahlzeit existiert nicht oder ist nicht mehr verfügbar."
        onRefresh={refetch}
        isRefreshing={isLoading}
        minHeight={height - 150}
      />
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

    // Entferne "_A", "_B", "_C" etc. am Ende (case-insensitive)
    formatted = formatted.replace(/_[A-Z]$/i, '');

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
    <View className="flex-1 bg-background-0">
      <ScrollView className="flex-1 p-4">
        {/* Header Card */}
        <Card variant="elevated" className="p-4 mb-4 shadow-md bg-secondary-100">
          <Text className="text-4xl font-bold mb-2">{meal.name}</Text>
          <Text className="text-lg mb-4">Kategorie: {meal.category}</Text>
        </Card>

        {/* Preise */}
        <Card variant="elevated" className="p-4 mb-4 shadow-md bg-secondary-100">
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="cash"
              size={30}
              color="#FBC02D"
              style={{ marginRight: 8 }}
            />
            <Text className="text-2xl font-semibold">Preise</Text>
          </View>
          {meal.prices?.map((price: any, index: number) => (
            <View key={index} className="flex-row justify-between mb-2">
              <Text className="text-lg">{price.priceType}:</Text>
              <Text className="text-lg font-semibold">
                {price.price.toFixed(2)}€
              </Text>
            </View>
          ))}
        </Card>

        {/* Generelle-Infos */}
        {generalBadges && generalBadges.length > 0 && (
          <Card variant="elevated" className="p-4 mb-4 shadow-md bg-secondary-100">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="information-circle"
                size={30}
                color="#1565C0"
                style={{ marginRight: 8 }}
              />
              <Text className="text-2xl font-semibold">Generelle-Infos</Text>
            </View>
            {generalBadges.map((badge: any, index: number) => (
              <View key={index} className="mb-3">
                <Text className="text-base font-semibold">
                  {formatBadgeName(badge.name)}
                </Text>
                <Text className="text-sm text-gray-600">
                  {badge.description}
                </Text>
              </View>
            ))}
          </Card>
        )}

        <Accordion
          type="multiple"
          className="mb-4 rounded-lg overflow-hidden border-none shadow-md bg-transparent"
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
                    <AccordionTitleText className="text-2xl">
                      Umwelt-Info
                    </AccordionTitleText>
                  </View>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                {environmentBadges.map((badge: any, index: number) => (
                  <View key={index} className="mb-3">
                    <Text className="text-base font-semibold">
                      {formatBadgeName(badge.name)}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {badge.description}
                    </Text>
                    {badge.name.toLowerCase().includes('co2') &&
                      meal.co2Bilanz && (
                        <Text className="text-sm text-gray-500 mt-1">
                          CO₂-Bilanz: {meal.co2Bilanz}g
                        </Text>
                      )}
                    {badge.name.toLowerCase().includes('h2o') &&
                      meal.waterBilanz && (
                        <Text className="text-sm text-gray-500 mt-1">
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
                    <AccordionTitleText className="text-2xl">
                      Allergene
                    </AccordionTitleText>
                  </View>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                {meal.additives.map((additive: any, index: number) => (
                  <View key={index} className="mb-2">
                    <Text className="text-base">
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
      <GenerateFab
        onPress={() => {
          handleRecipePress();
        }}
        placement="bottom left"
      />
      <FavoriteFab
        onPress={() => {
          handleFavoritePress();
        }}
        isFavorite={isFavorite}
        placement="bottom right"
      />
    </View>
  );
}
