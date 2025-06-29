import { useCanteens } from '@/hooks/useMensaApi';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Keyword-based image map
const imageMap: Record<string, any> = {
  ash_berlin_hellersdorf: require('@/assets/mensas/ash_berlin_hellersdorf.jpg'),
  hfm_charlottenstrae: require('@/assets/mensas/hfm_charlottenstrae.jpg'),
  bht_luxemburger_strae: require('@/assets/mensas/bht_luxemburger_strae.jpg'),
  backshop_bht_luxemburger_straee: require('@/assets/mensas/bht_luxemburger_strae.jpg'),
  spti_bht_haus_grashofe: require('@/assets/mensas/spti_bht_haus_grashof.jpg'),
  htw_treskowallee: require('@/assets/mensas/htw_treskowallee.jpg'),
  htw_wilhelminenhof: require('@/assets/mensas/htw_wilhelminenhof.jpg'),
  charit_zahnklinik: require('@/assets/mensas/charit_zahnklinik.jpg'),
  hu_sd: require('@/assets/mensas/hu_sd.jpg'),
  spti_charit_zahnklinik: require('@/assets/mensas/spti_charit_zahnklinik.jpg'),
  backshop_hfm_charlottenstrae: require('@/assets/mensas/backshop_hfm_charlottenstrae.jpg'),
  ehb_teltower_damm: require('@/assets/mensas/ehb_teltower_damm.jpg'),
  fu_herrenhaus_dppel: require('@/assets/mensas/fu_herrenhaus_dppel.jpg'),
  fu_i_shokud: require('@/assets/mensas/fu_i_shokud.jpg'),
  fu_ii: require('@/assets/mensas/fu_ii.jpg'),
  fu_koserstrae: require('@/assets/mensas/fu_koserstrae.jpg'),
  fu_lankwitz_malteserstrae: require('@/assets/mensas/fu_lankwitz_malteserstrae.jpg'),
  fu_pharmazie: require('@/assets/mensas/fu_pharmazie.jpg'),
  backshop_fu_rechtswissenschaften: require('@/assets/mensas/backshop_fu_rechtswissenschaften.jpg'),
  spti_shokud_fu_i: require('@/assets/mensas/spti_shokud_fu_i.jpg'),
  hfs_ernst_busch: require('@/assets/mensas/hfs_ernst_busch.jpg'),
  backshop_htw_wilhelminenhof: require('@/assets/mensas/backshop_htw_wilhelminenhof.jpg'),
  hwr_badensche_strae: require('@/assets/mensas/hwr_badensche_strae.jpg'),
  backshop_hwr_altfriedrichsfelde: require('@/assets/mensas/backshop_hwr_altfriedrichsfelde.jpg'),
  hu_nord: require('@/assets/mensas/hu_nord.jpg'),
  hu_oase_adlershof: require('@/assets/mensas/hu_oase_adlershof.jpg'),
  backshop_hu_ct: require('@/assets/mensas/backshop_hu_ct.jpg'),
  backshop_hu_oase_adlershof: require('@/assets/mensas/hu_oase_adlershof.jpg'),
  khsb: require('@/assets/mensas/khsb.jpg'),
  tu_hardenbergstrae: require('@/assets/mensas/tu_hardenbergstrae.jpg'),
  tu_marchstrae: require('@/assets/mensas/tu_marchstrae.jpg'),
  tu_veggie_20__die_vegane_mensa: require('@/assets/mensas/tu_veggie_20__die_vegane_mensa.jpg'),
  backshop_tu_hardenbergstrae: require('@/assets/mensas/tu_hardenbergstrae.jpg'),
  backshop_tu_wetterleuchten: require('@/assets/mensas/backshop_tu_wetterleuchten.jpg'),
  khs_weiensee: require('@/assets/mensas/khs_weiensee.jpg'),
  spti_tu_hardenbergstrae: require('@/assets/mensas/tu_hardenbergstrae.jpg'),
  // Add more as needed
};

function getImageForCanteen(name: string) {
  const key = name
    .replace(/^mensa/i, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '');

  // console.log('Generated key:', key);  // <-- for debug

  return imageMap[key] || require('@/assets/mensas/default.jpg');
}

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371e3; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance; // in meters
}


export default function MensenListScreen() {
  const { data: canteens, loading, error } = useCanteens();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [sortedCanteens, setSortedCanteens] = useState<any[]>([]);

   // Get user's location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Standort nicht erlaubt', 'Bitte erlaube den Zugriff auf deinen Standort.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  // Sort canteens by distance
  useEffect(() => {
  if (!location || !canteens) return;

  const withDistance = canteens.map((canteen) => {
    if (
      canteen.address &&
      canteen.address.geoLocation &&
      typeof canteen.address.geoLocation.latitude === 'number' &&
      typeof canteen.address.geoLocation.longitude === 'number'
    ) {
      const distance = getDistanceFromLatLonInMeters(
        location.coords.latitude,
        location.coords.longitude,
        canteen.address.geoLocation.latitude,
        canteen.address.geoLocation.longitude
      );
      return { ...canteen, distance };
    }
    return { ...canteen, distance: Number.MAX_SAFE_INTEGER };
  });

  const sorted = withDistance.sort((a, b) => a.distance - b.distance);
  setSortedCanteens(sorted);
}, [location, canteens]);



  const filteredSortedCanteens = sortedCanteens.filter(canteen =>
    canteen.name.toLowerCase().includes(search.toLowerCase())
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.text}>Lade Mensen und Standort...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.text, { color: 'red' }]}>Fehler: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Suche nach Mensa"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#666"
      />

      <FlatList
        data={filteredSortedCanteens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
            <Image
              source={getImageForCanteen(item.name)}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>
              {item.city} – {(item.distance / 1000).toFixed(2)} km entfernt
            </Text>
            <Text style={styles.address}>
              {item.address
                ? `${item.address.street}, ${item.address.zipcode} ${item.address.city}`
                : 'Adresse nicht verfügbar'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  search: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#333',
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: '#cccccc',
    fontSize: 14,
  },
  address: {
    color: '#999999',
    fontSize: 12,
    marginTop: 4,
  },
  text: {
    color: '#ffffff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
