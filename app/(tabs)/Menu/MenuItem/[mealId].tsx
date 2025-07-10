import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDownIcon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from 'react';

export default function MealView() {
  const params = useLocalSearchParams<{ mealData: string; mealId: string }>();

  // State für Favoriten-Status
  const [isFavorite, setIsFavorite] = useState(false);

  // Meal-Objekt aus JSON-String parsen
  const meal = params.mealData ? JSON.parse(params.mealData) : null;

  console.log('=== MEAL VIEW ===');
  console.log('Received meal:', meal?.name);

  // Handler für Favoriten-Button
  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

  // Handler für Rezept-Button
  const handleRecipePress = () => {
    console.log('Rezept-Button gedrückt');
    router.navigate({
      pathname: '/chatbot/[mealId]',
      params: {
        mealId: meal.id,
        mealName: meal.name,
      },
    });
  };

  if (!meal) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Fehler beim Laden der Mahlzeit</Text>
      </View>
    );
  }

  // Helper component for icon titles
  const IconTitle = ({
    IconComponent,
    iconName,
    text,
    color = '#666',
  }: {
    IconComponent: any;
    iconName: string;
    text: string;
    color?: string;
  }) => (
    <View className="flex-row items-center">
      <IconComponent
        name={iconName}
        size={20}
        color={color}
        style={{ marginRight: 8 }}
      />
      <Text className="text-base font-semibold">{text}</Text>
    </View>
  );

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
          {meal.prices?.map(
            (
              price: {
                priceType:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined;
                price: number;
              },
              index: Key | null | undefined,
            ) => (
              <View key={index} className="flex-row justify-between mb-2">
                <Text className="text-base">{price.priceType}:</Text>
                <Text className="text-base font-semibold">
                  {price.price.toFixed(2)}€
                </Text>
              </View>
            ),
          )}
        </Card>

        <Accordion type="multiple" className="mb-4 rounded-lg overflow-hidden">
          {/* Badges */}
          {meal.badges && meal.badges.length > 0 && (
            <AccordionItem value="badges">
              <AccordionHeader>
                <AccordionTrigger>
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name="information-circle"
                      size={30}
                      color="#1565C0"
                      style={{ marginRight: 8 }}
                    />
                    <AccordionTitleText>Generelle-Infos</AccordionTitleText>
                  </View>
                  <AccordionIcon as={ChevronDownIcon} />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                {meal.badges.map(
                  (
                    badge: {
                      name:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      description:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    },
                    index: Key | null | undefined,
                  ) => (
                    <View key={index} className="mb-3">
                      <Text className="text-sm font-semibold">
                        {badge.name}
                      </Text>
                      <Text className="text-xs text-gray-600">
                        {badge.description}
                      </Text>
                    </View>
                  ),
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Umwelt-Informationen */}
          {(meal.co2Bilanz || meal.waterBilanz) && (
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
                  <AccordionIcon as={ChevronDownIcon} />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
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
                    <AccordionTitleText>Zusatzstoffe</AccordionTitleText>
                  </View>
                  <AccordionIcon as={ChevronDownIcon} />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                {meal.additives.map(
                  (
                    additive: {
                      referenceid:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                      text:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    },
                    index: Key | null | undefined,
                  ) => (
                    <View key={index} className="mb-2">
                      <Text className="text-sm">
                        <Text className="font-semibold">
                          {additive.referenceid}:
                        </Text>{' '}
                        {additive.text}
                      </Text>
                    </View>
                  ),
                )}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </ScrollView>
      <View className="flex-row justify-between items-center p-4">
        <Button
          size="lg"
          className="rounded-full p-8"
          onPress={handleFavoritePress}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={45}
            color={isFavorite ? '#FF6B6B' : '#999'}
          />
        </Button>
        <Button
          size="lg"
          className="rounded-full p-8"
          onPress={handleRecipePress}
        >
          <Ionicons name="sparkles" size={45} color="#FBC02D" />
        </Button>
      </View>
    </View>
  );
}
