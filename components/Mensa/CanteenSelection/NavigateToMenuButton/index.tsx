import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';

interface NavigateToMenuButtonProps {
  canteenId: string;
}

export const NavigateToMenuButton = (props: NavigateToMenuButtonProps) => {
  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/menu/[canteenId]',
      params: { canteenId: props.canteenId },
    });
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
        🗒 Menü angucken
      </Text>
    </Button>
  );
};
