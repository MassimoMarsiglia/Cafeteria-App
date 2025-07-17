import ErrorView from '@/components/Mensa/ErrorView';
import LoadingView from '@/components/Mensa/LoadingView';
import CanteenCard from '@/components/Mensa/MensaCard';
import NotFoundView from '@/components/Mensa/NotFoundView';
import { Searchbar } from '@/components/Mensa/Searchbar';
import { useUserLocation } from '@/hooks/Mensa/useUserLocation';
import { useGetCanteensQuery } from '@/services/mensaApi';
import { getDistanceFromLatLonInMeters } from '@/utils/distance';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

export default function MensenListScreen() {
  const { data: canteens, isLoading, error, refetch } = useGetCanteensQuery();
  const [search, setSearch] = useState('');
  const location = useUserLocation();
  const [sortedCanteens, setSortedCanteens] = useState<any[]>([]);
  const [chatVisible, setChatVisible] = useState(false);

  // imageMap
  // getUserLocation
  useEffect(() => {
    if (!canteens) return;

    // Filter out canteens with 'Backshop' or 'Späti' in the name (case-insensitive)
    const filteredCanteens = canteens.filter(canteen => {
      const lowerName = canteen.name.toLowerCase();
      return !lowerName.includes('backshop') && !lowerName.includes('späti');
    });

    // If no location, show canteens without sorting
    if (!location) {
      setSortedCanteens(filteredCanteens); // no sorting
      return;
    }

    // Sort canteen base on location
    const withDistance = filteredCanteens.map(canteen => {
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

    router.navigate({
      pathname: '/mensen/mensenDetail/[canteenId]',
      params: {
        canteenId: canteen.id,
        imageKey, // pass the key here
      },
    });
  };

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView />;
  if (!canteens || canteens.length === 0) return <NotFoundView />;

  return (
    <View className="flex-1 bg-background-0 px-4 pt-4">
      <Searchbar
        placeholder="Suche nach Mensen"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CanteenCard canteen={item} onPress={() => handlePress(item)} />
        )}
      />
    </View>
  );
}
