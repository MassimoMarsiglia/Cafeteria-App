import { FavoriteFab } from '@/components/FavoriteFab';
import { CanteenBusinessHours } from '@/components/Mensa/CanteenBusinessHours';
import { CanteenContacts } from '@/components/Mensa/CanteenContacts';
import { CanteenHeader } from '@/components/Mensa/CanteenHeader/';
import ErrorView from '@/components/Mensa/ErrorView';
import LoadingView from '@/components/Mensa/LoadingView';
import NotFoundView from '@/components/Mensa/NotFoundView';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Icon, InfoIcon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Toast, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { useSettings } from '@/hooks/redux/useSettings';
import { useGetCanteensQuery } from '@/services/mensaApi';
import images from '@/utils/mensaImage';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MensaDetail() {
  const { canteenId, imageKey } = useLocalSearchParams();

  const { data, isLoading, error } = useGetCanteensQuery();

  const { favoriteCanteen, setFavoriteCanteen } = useSettings();

  const toast = useToast();

  const canteen = data?.find(c => c.id === canteenId); // filter in JS instead of request so less gets cached

  const handleFavoritePress = () => {
    setFavoriteCanteen(canteen!);

    // Show toast
    const newId = Math.random();
    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration: 2000,
      render: ({ id }: { id: string | number }) => {
        const uniqueToastId = 'toast-' + id;
        return (
          <SafeAreaView>
            <Toast
              nativeID={uniqueToastId}
              action="info"
              variant="outline"
              className="border-2"
            >
              <HStack space="md">
                <Icon as={InfoIcon} />
                <VStack space="xs">
                  <ToastTitle className="text-black dark:text-white">
                    Lieblingsmensa wurde aktualisiert
                  </ToastTitle>
                  <Text className="text-gray-500 dark:text-gray-400">
                    {canteen?.name}
                  </Text>
                </VStack>
              </HStack>
            </Toast>
          </SafeAreaView>
        );
      },
    });
  };

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView />;
  if (!canteen) return <NotFoundView />;

  const imageSource =
    imageKey && typeof imageKey === 'string' && imageKey in images
      ? images[imageKey as keyof typeof images]
      : null;

  // Define collapsable day section

  return (
    <View className="flex-1 bg-background-0">
      <ScrollView
        className="p-5"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {imageSource && (
          <Image
            source={imageSource}
            resizeMode="cover"
            className="w-full h-52 mb-5 rounded-lg"
            alt="Canteen Image"
          />
        )}

        <CanteenHeader name={canteen.name} address={canteen.address!} />

        <CanteenContacts
          address={canteen.address!}
          contactInfo={canteen.contactInfo!}
        />
        <Divider orientation="horizontal" className="my-4" />

        {/* <CanteenSelection canteen={canteen} /> */}

        {canteen.businessDays!.length > 0 && (
          <View className="w-full mt-5">
            <Text className="text-black dark:text-white text-lg font-bold mb-3">
              Business Hours
            </Text>

            <CanteenBusinessHours businessDays={canteen.businessDays!} />
          </View>
        )}
      </ScrollView>
      <FavoriteFab
        onPress={() => {
          handleFavoritePress();
        }}
        isFavorite={favoriteCanteen?.id === canteen.id}
        placement="bottom-right"
      />
    </View>
  );
}
