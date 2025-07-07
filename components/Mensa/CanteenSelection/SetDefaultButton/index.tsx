import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Icon, InfoIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Toast, ToastTitle, useToast } from '@/components/ui/toast';
import { VStack } from '@/components/ui/vstack';
import { useSettings } from '@/hooks/redux/useSettings';
import { Canteen } from '@/services/mensaTypes';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CanteenSelectionProps {
  canteen: Canteen;
}

export const SetDefaultCanteenButton = (props: CanteenSelectionProps) => {
  const { setFavoriteCanteen } = useSettings();
  const toast = useToast();

  const showNewToast = () => {
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
                    Default Mensa wurde aktualisiert
                  </ToastTitle>
                  <Text className="text-gray-500 dark:text-gray-400">
                    {props.canteen.name}
                  </Text>
                </VStack>
              </HStack>
            </Toast>
          </SafeAreaView>
        );
      },
    });
  };

  const handlePress = () => {
    setFavoriteCanteen(props.canteen);
    showNewToast();
  };
  return (
    <Button
      variant="solid"
      className="bg-[#FDFAF6] dark:bg-gray-950 border-2 border-red-500"
      onPress={handlePress}
    >
      <Text
        className="text-center font-roboto"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        Als Default Mensa setzen
      </Text>
    </Button>
  );
};
