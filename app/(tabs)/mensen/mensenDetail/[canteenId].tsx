import { useCanteens } from '@/hooks/useMensaApi';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function MensaDetail() {
  const { canteenId, imageKey } = useLocalSearchParams();
  const { data: canteens, loading, error } = useCanteens();

  const images = {
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
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.text}>Loading canteen details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Failed to load canteen data.</Text>
      </View>
    );
  }

  const canteen = canteens.find((c) => c.id === canteenId);
  if (!canteen) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Canteen not found.</Text>
      </View>
    );
  }

  const imageSource = imageKey ? images[imageKey as string] : null;

  return (
  <ScrollView contentContainerStyle={styles.container}>
    {imageSource && (
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
    )}

    <Text style={styles.title}>{canteen.name}</Text>
    <Text style={styles.address}>
      {canteen.address?.street}, {canteen.address?.zipcode} {canteen.address?.city}
    </Text>

    {canteen.description && (
      <Text style={styles.description}>{canteen.description}</Text>
    )}

    {/* Contact Section */}
    {canteen.contactInfo && (
      <View style={styles.contactContainer}>
        <Text style={styles.sectionTitle}>Contact Information:</Text>

        {/* Phone box */}
        {canteen.contactInfo.phone && (
          <View style={styles.contactBox}>
            <Text style={styles.contactText}>📞 {canteen.contactInfo.phone}</Text>
          </View>
        )}

        {/* Email box */}
        {canteen.contactInfo.email && (
          <View style={styles.contactBox}>
            <Text style={styles.contactText}>📧 {canteen.contactInfo.email}</Text>
          </View>
        )}
      </View>
    )}

    {/* Business Hours Section */}
    {canteen.businessDays?.length > 0 && (
      <View style={styles.businessDaysContainer}>
        <Text style={styles.sectionTitle}>Business Hours:</Text>
        {canteen.businessDays.map((dayObj) => (
          <View key={dayObj.day} style={styles.dayContainer}>
            <View style={styles.dayRow}>
              <Text style={styles.dayTitle}>{dayObj.day}:</Text>
              <View style={styles.hoursWrapper}>
                {dayObj.businessHours.length > 0 ? (
                  dayObj.businessHours.map((hours, idx) => (
                    <Text key={idx} style={styles.hoursText}>
                      {hours.businessHourType}: {hours.openAt} - {hours.closeAt}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.hoursText}>Closed</Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    )}
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  address: {
    fontSize: 16,
    marginTop: 4,
    color: '#ccc',
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22,
    color: '#eee',
  },
  text: {
    color: '#fff',
  },
  contactContainer: {
    marginTop: 20,
    width: '100%',
  },
  businessDaysContainer: {
    marginTop: 20,
    width: '100%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#fff',
  },
  dayContainer: {
    marginBottom: 10,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dayTitle: {
    fontWeight: '600',
    fontSize: 16,
    width: 90,
    color: '#fff',
  },
  hoursWrapper: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  hoursText: {
    fontSize: 14,
    color: '#ccc',
  },
  contactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222', // almost black but lighter than pure black
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10, // rounded corners
    marginBottom: 10,
  },
  contactText: {
    color: '#ddd', // light gray text to contrast dark bg
    fontSize: 16,
  },
});
