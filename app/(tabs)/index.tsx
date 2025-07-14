import { useSettings } from '@/hooks/redux/useSettings';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Alert,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const HomeView = () => {
  const { favoriteCanteen } = useSettings();

  useEffect(() => {
    if (favoriteCanteen?.id) {
      router.replace(`/menu/${favoriteCanteen.id}`);
    }
  }, [favoriteCanteen]);

  const handleNavigate = () => {
    Alert.alert(
      'Anweisung',
      'Wähle deine Lieblingsmensa, indem du auf das ❤️-Icon klickst.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Weiter',
          onPress: () => router.navigate('/mensen/mensenList'),
        },
      ],
    );
  };

  return (
    <ImageBackground
      source={require('@/assets/welcome-animation-2.gif')}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <Text className="text-white text-3xl font-bold mt-6 text-center">
          Willkommen bei Schmausa
        </Text>
        <Text className="text-gray-400 text-base mt-2 text-center">
          Erstellt von Schmausa-Team
        </Text>
        <TouchableOpacity
          onPress={handleNavigate}
          className="mt-10 bg-blue-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white text-base font-semibold">
            Lieblingsmensa wählen
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default HomeView;
