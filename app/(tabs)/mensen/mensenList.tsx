import CanteenCard from '@/components/Mensa/MensaCard';
import { useUserLocation } from '@/hooks/Mensa/useUserLocation';
import { useCanteens } from '@/hooks/useMensaApi';
import { getDistanceFromLatLonInMeters } from '@/utils/distance';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function MensenListScreen() {
  const { data: canteens, loading, error } = useCanteens();
  const [search, setSearch] = useState('');
  const location = useUserLocation();
  const [sortedCanteens, setSortedCanteens] = useState<any[]>([]);

  // imageMap
  // getUserLocation

  // Sort canteens by distance
  useEffect(() => {
    if (!location || !canteens) return;

    const withDistance = canteens.map(canteen => {
      const geo = canteen.address?.geoLocation;
      const distance =
        geo?.latitude && geo?.longitude
          ? getDistanceFromLatLonInMeters(
              location.coords.latitude,
              location.coords.longitude,
              geo.latitude,
              geo.longitude,
            )
          : Number.MAX_SAFE_INTEGER;

      return { ...canteen, distance };
    });

    setSortedCanteens(withDistance.sort((a, b) => a.distance - b.distance));
  }, [location, canteens]);

  const filtered = sortedCanteens.filter(canteen =>
    canteen.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handlePress = (canteen: any) => {
    const imageKey = canteen.name
      .replace(/^mensa/i, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '');

    router.replace({
      pathname: '/mensen/mensenDetail/[canteenId]',
      params: {
        canteenId: canteen.id,
        imageKey, // pass the key here
      },
    });
  };

  if (loading || !location) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007bff" />
        <Text className="text-black dark:text-white mt-2">
          Lade Mensen und Standort...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Fehler: {error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <TextInput
        placeholder="Suche nach Mensa"
        className=" bg-white p-2.5 rounded-lg mb-3 text-black"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#666"
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CanteenCard canteen={item} onPress={() => handlePress(item)} />
        )}
      />
    </View>
  );
}
