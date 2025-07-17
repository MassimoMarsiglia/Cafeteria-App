import { ErrorState } from '@/components/ErrorView';
import { Button, ButtonText } from '@/components/ui/button';
import { View } from '@/components/ui/view';
import { router, Stack } from 'expo-router';
import { Dimensions } from 'react-native';

export default function NotFoundScreen() {
  const { height } = Dimensions.get('window');

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Seite nicht gefunden' }} />
      <View className="flex-1">
        <ErrorState
          icon="closecircleo"
          title="404 - Seite nicht gefunden"
          description="Diese Seite existiert nicht oder wurde verschoben."
          onRefresh={() => {}}
          isRefreshing={false}
          minHeight={height - 200}
        />
        <View className="px-6 pb-8 items-center">
          <Button onPress={handleGoHome} className="bg-primary-500">
            <ButtonText className="text-white">Zur Startseite</ButtonText>
          </Button>
        </View>
      </View>
    </>
  );
}
