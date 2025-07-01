import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export default function ErrorView() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-black dark:text-white mt-2">
        Failed to load canteen data.
      </Text>
    </View>
  );
}
