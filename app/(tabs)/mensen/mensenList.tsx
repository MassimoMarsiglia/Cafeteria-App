import { ErrorState } from '@/components/ErrorView';
import LoadingView from '@/components/Mensa/LoadingView';
import CanteenCard from '@/components/Mensa/MensaCard';
import { Searchbar } from '@/components/Mensa/Searchbar';
import { useUserLocation } from '@/hooks/Mensa/useUserLocation';
import { useGetCanteensQuery } from '@/services/mensaApi';
import { getDistanceFromLatLonInMeters } from '@/utils/distance';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, View } from 'react-native';

export default function MensenListScreen() {
  const {
    data: canteens,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetCanteensQuery();
  const [search, setSearch] = useState('');
  const location = useUserLocation();
  const [sortedCanteens, setSortedCanteens] = useState<any[]>([]);
  const { height } = Dimensions.get('window');

  useEffect(() => {
    if (!canteens) return;

    if (!location) {
      setSortedCanteens(canteens);
      return;
    }

    // Sort canteen base on location
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

    router.navigate({
      pathname: '/mensen/mensenDetail/[canteenId]',
      params: {
        canteenId: canteen.id,
        imageKey, // pass the key here
      },
    });
  };

  if (isLoading) return <LoadingView />;

  // Error State mit neuer ErrorState Component
  if (error) {
    return (
      <ErrorState
        icon="wifi"
        title="Fehler beim Laden der Mensen"
        description="Die Mensen konnten nicht geladen werden. Überprüfe deine Internetverbindung."
        onRefresh={refetch} // ← Refetch Funktion
        isRefreshing={isLoading || isFetching} // ← Loading oder Fetching
        minHeight={height - 150}
      />
    );
  }

  // No Data State mit neuer ErrorState Component
  if (!canteens || canteens.length === 0) {
    return (
      <ErrorState
        icon="closecircleo"
        title="Keine Mensen gefunden"
        description="Es konnten keine Mensen geladen werden. Versuche es später erneut."
        onRefresh={refetch} // ← Refetch Funktion
        isRefreshing={isLoading || isFetching} // ← Loading oder Fetching
        minHeight={height - 150}
      />
    );
  }

  return (
    <View className="flex-1 bg-background-0 px-4 pt-4">
      <Searchbar
        placeholder="Suche nach Mensen"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isFetching}
            onRefresh={refetch}
          />
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
