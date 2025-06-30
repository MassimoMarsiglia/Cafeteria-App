import CanteenContact from '@/components/Mensa/CanteenContact';
import CanteenHeader from '@/components/Mensa/CanteenHeader';
import CollapsibleDay from '@/components/Mensa/CollapsibleDay';
import ErrorView from '@/components/Mensa/ErrorView';
import LoadingView from '@/components/Mensa/LoadingView';
import NotFoundView from '@/components/Mensa/NotFoundView';
import { useCanteens } from '@/hooks/useMensaApi';
import images from '@/utils/mensaImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export default function MensaDetail() {
  const { canteenId, imageKey } = useLocalSearchParams();
  const { data: canteens, loading, error } = useCanteens();
  const router = useRouter();

  if (loading) return <LoadingView />;
  if (error) return <ErrorView />;

  const canteen = canteens.find(c => c.id === canteenId);
  if (!canteen) return <NotFoundView />;

  const imageSource = imageKey ? images[imageKey as string] : null;

  // Define collapsable day section

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'center' }}
      className="bg-background p-5"
    >
      {Platform.OS === 'android' && (
        <Pressable onPress={() => router.back()} className="self-start mb-3">
          <Text className="text-black dark:text-white text-base">← Zurück</Text>
        </Pressable>
      )}

      {imageSource && (
        <Image
          source={imageSource}
          resizeMode="cover"
          className="w-full h-52 mb-5 rounded-lg"
        />
      )}

      <CanteenHeader name={canteen.name} address={canteen.address} />

      {canteen.description && (
        <Text className="text-gray-800 dark:text-gray-200 text-base leading-6 mt-3">
          {canteen.description}
        </Text>
      )}

      <CanteenContact contactInfo={canteen.contactInfo} />

      {canteen.businessDays?.length > 0 && (
        <View className="w-full mt-5">
          <Text className="text-black dark:text-white text-lg font-bold mb-2">
            Geschäftszeiten:
          </Text>
          {canteen.businessDays.map((dayObj: any) => (
            <CollapsibleDay key={dayObj.day} dayObj={dayObj} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
