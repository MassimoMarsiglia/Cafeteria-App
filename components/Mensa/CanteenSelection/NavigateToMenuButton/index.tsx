import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

interface NavigateToMenuButtonProps {
  canteenId: string;
}

export const NavigateToMenuButton = (props: NavigateToMenuButtonProps) => {
  const handlePress = () => {
    router.navigate({
      pathname: '/(tabs)/menu/[canteenId]',
      params: { canteenId: props.canteenId },
    });
  };

  return (
    <View className="absolute bottom-6 right-6 z-50">
      <Pressable
        onPress={handlePress}
        className="bg-[#FDFAF6] dark:bg-gray-950 px-5 py-3 rounded-full shadow-lg border border-gray-300 dark:border-gray-700 active:opacity-80 active:scale-95"
        style={{ elevation: 6 }}
      >
        <Text className="text-center font-bold text-black dark:text-white text-base">
          🗒 Menü angucken
        </Text>
      </Pressable>
    </View>
  );
};
