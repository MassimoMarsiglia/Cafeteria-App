import { useCanteens } from '@/hooks/useMensaApi';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
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
    <View className="flex-1 justify-center items-center bg-black">
      <ActivityIndicator size="large" color="#007bff" />
      <Text className="text-white mt-2">Loading canteen details...</Text>
    </View>
  );
}

if (error) {
  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white mt-2">Failed to load canteen data.</Text>
    </View>
  );
}

const canteen = canteens.find(c => c.id === canteenId);
if (!canteen) {
  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white mt-2">Canteen not found.</Text>
    </View>
  );
}

const imageSource = imageKey ? images[imageKey as string] : null;

const CollapsibleDay = ({ dayObj }: { dayObj: any }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      className="mb-4 bg-neutral-300 dark:bg-neutral-800 rounded-lg px-6 py-4"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center space-x-2">
          <Text className="text-black dark:text-white font-semibold text-xl">{dayObj.day} </Text>
          {expanded && <Feather name="calendar" size={24} color="green" />}
        </View>

        <View className="flex-row items-center space-x-2">
          {expanded ? (
            <Feather name="chevron-up" color="white" size={24} />
          ) : (
            <Feather name="chevron-down" color="white" size={24} />
          )}
        </View>
      </View>

      {expanded && (
        <View className="mt-4">
          {dayObj.businessHours.length > 0 ? (
            dayObj.businessHours.map((hours: any, idx: number) => (
              <Text key={idx} className="text-gray-800 dark:text-gray-300 text-base mb-1">
                {hours.businessHourType}: {hours.openAt} - {hours.closeAt}
              </Text>
            ))
          ) : (
            <Text className="text-gray-800 dark:text-gray-300">Closed</Text>
          )}
        </View>
      )}
    </Pressable>
  );
};


return (
  <ScrollView contentContainerStyle={{ alignItems: 'center' }} className="bg-background p-5">
    {imageSource && (
      <Image source={imageSource} resizeMode="cover" className="w-full h-52 mb-5 rounded-lg" />
    )}

    <Text className="text-black dark:text-white text-2xl font-bold">{canteen.name}</Text>
    <Text className="text-gray-700 dark:text-gray-300 text-base mt-1">
      {canteen.address?.street}, {canteen.address?.zipcode} {canteen.address?.city}
    </Text>

    {canteen.description && (
      <Text className="text-gray-800 dark:text-gray-200 text-base leading-6 mt-3">{canteen.description}</Text>
    )}

    {/* Contact Info */}
    {canteen.contactInfo && (
      <View className="w-full mt-5">
        <Text className="text-black dark:text-white text-lg font-bold mb-2">Contact Information:</Text>

        {canteen.contactInfo.phone && (
          <View className="flex-row items-center bg-green-300 dark:bg-green-800 px-4 py-2 rounded-lg mb-3">
            <Text className="text-gray-800 dark:text-gray-200 text-lg">📞 {canteen.contactInfo.phone}</Text>
          </View>
        )}

        {canteen.contactInfo.email && (
          <View className="flex-row items-center bg-blue-300 dark:bg-blue-800 px-4 py-2 rounded-lg mb-3">
            <Text className="text-gray-800 dark:text-gray-200 text-lg">📧 {canteen.contactInfo.email}</Text>
          </View>
        )}
      </View>
    )}

    {canteen.businessDays?.length > 0 && (
  <View className="w-full mt-5">
    <Text className="text-black dark:text-white text-lg font-bold mb-2">Business Hours:</Text>

    {canteen.businessDays.map((dayObj: any) => (
      <CollapsibleDay key={dayObj.day} dayObj={dayObj} />
    ))}
  </View>
)}
  </ScrollView>
);
}