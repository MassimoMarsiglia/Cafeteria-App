import CanteenContact from '@/components/Mensa/CanteenContact';
import CanteenHeader from '@/components/Mensa/CanteenHeader';
import { CanteenSelection } from '@/components/Mensa/CanteenSelection';
import { formatBusinessHours } from '@/components/Mensa/CollapsibleDay';
import ErrorView from '@/components/Mensa/ErrorView';
import LoadingView from '@/components/Mensa/LoadingView';
import NotFoundView from '@/components/Mensa/NotFoundView';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useGetCanteensQuery } from '@/services/mensaApi';
import images from '@/utils/mensaImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';

export default function MensaDetail() {
  const { canteenId, imageKey } = useLocalSearchParams();

  const {
    data: canteens,
    isLoading,
    error,
    refetch,
  } = useGetCanteensQuery({
    ID: canteenId as string,
  });

  const router = useRouter();

  const canteen = canteens?.[0];

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView />;
  if (!canteen) return <NotFoundView />;

  const imageSource =
    imageKey && typeof imageKey === 'string' && imageKey in images
      ? images[imageKey as keyof typeof images]
      : null;

  // Define collapsable day section

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'center' }}
      className="bg-background-0 p-5"
    >
      {imageSource && (
        <Image
          source={imageSource}
          resizeMode="cover"
          className="w-full h-52 mb-5 rounded-lg"
          alt="Canteen Image"
        />
      )}

      <CanteenHeader name={canteen.name} address={canteen.address} />

      <CanteenContact contactInfo={canteen.contactInfo} />

      <CanteenSelection canteen={canteen} />

      {canteen.businessDays!.length > 0 && (
        <View className="w-full mt-5">
          <Text className="text-black dark:text-white text-lg font-bold mb-3">
            Business Hours
          </Text>

          {Object.entries(formatBusinessHours(canteen.businessDays!)).map(
            ([label, times]) => (
              <View
                key={label}
                className="mb-4 px-4 py-3 rounded-xl bg-[#FDFAF6] dark:bg-gray-950 border border-gray-600"
              >
                <Text className="text-blue-800 dark:text-blue-300 font-semibold text-base mb-2">
                  📅 {label}
                </Text>

                {times.length > 0 ? (
                  times.map((entry, idx) => (
                    <Text
                      key={idx}
                      className="text-gray-800 dark:text-gray-200 text-sm mb-1"
                    >
                      {entry}
                    </Text>
                  ))
                ) : (
                  <Text className="text-gray-500 italic dark:text-gray-400">
                    Closed
                  </Text>
                )}
              </View>
            ),
          )}
        </View>
      )}
    </ScrollView>
  );
}
