import { HStack } from '@/components/ui/hstack';
import { Icon, InfoIcon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { Toast, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { useSettings } from '@/hooks/redux/useSettings';
import { getImageForCanteen } from '@/utils/imageMap';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CanteenCard({
  canteen,
  onPress,
}: {
  canteen: any;
  onPress: () => void;
}) {
  const { favoriteCanteen, setFavoriteCanteen } = useSettings();
  const toast = useToast();

  const handleFavoritePress = () => {
    setFavoriteCanteen(canteen);

    // Show toast
    const newId = Math.random();
    toast.show({
      id: newId.toString(),
      placement: 'top',
      duration: 2000,
      render: ({ id }) => {
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
                    {canteen.name}
                  </Text>
                </VStack>
              </HStack>
            </Toast>
          </SafeAreaView>
        );
      },
    });
  };

  const isFavorite = favoriteCanteen?.id === canteen.id;

  return (
    <TouchableOpacity
      className="bg-secondary-100 p-4 rounded-lg mb-2.5"
      onPress={onPress}
    >
      <Image
        source={getImageForCanteen(canteen.name)}
        className="w-full h-[150px] rounded-lg mb-2.5 bg-[#333]"
        resizeMode="cover"
        alt="All canteen images"
      />

      {/* Canteen name (only once) */}
      <Text className="text-black dark:text-white text-base font-semibold mb-1">
        {canteen.name}
      </Text>

      {/* City and distance */}
      <Text className="text-gray-700 dark:text-[#cccccc] text-sm mb-1">
        {canteen.city} – {(canteen.distance / 1000).toFixed(2)} km entfernt
      </Text>

      {/* Address and heart icon in same row */}
      <HStack className="flex-row justify-between items-center mt-1">
        {/* Address on the left */}
        <Text className="text-black dark:text-[#999999] text-xs w-4/5">
          {canteen.address
            ? `${canteen.address.street}, ${canteen.address.zipcode} ${canteen.address.city}`
            : 'Adresse nicht verfügbar'}
        </Text>

        {/* Heart icon on the right */}
        <TouchableOpacity onPress={handleFavoritePress}>
          <Text
            className={`text-3xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          >
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </HStack>
    </TouchableOpacity>
  );
}
