import { Text } from '@/components/ui/text';
import { ActivityIndicator, View } from 'react-native';

export default function LoadingView() {
  return (
    <View className="flex-1 justify-center items-center bg-background-0">
      <ActivityIndicator size="large" color="#007bff" />
      <Text className="text-black dark:text-white mt-2">
        Loading canteen details...
      </Text>
    </View>
  );
}
