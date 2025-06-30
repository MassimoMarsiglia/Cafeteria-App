import { getImageForCanteen } from '@/utils/imageMap';
import { Image, Text, TouchableOpacity } from 'react-native';

export default function CanteenCard({
  canteen,
  onPress,
}: {
  canteen: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="bg-slate-600 dark:bg-[#1f1f1f] p-4 rounded-xl mb-2.5 border border-[#333]"
      onPress={onPress}
    >
      <Image
        source={getImageForCanteen(canteen.name)}
        className="w-full h-[150px] rounded-lg mb-2.5 bg-[#333]"
        resizeMode="cover"
      />
      <Text className="text-white text-base font-semibold">{canteen.name}</Text>
      <Text className="text-[#cccccc] text-sm">
        {canteen.city} – {(canteen.distance / 1000).toFixed(2)} km entfernt
      </Text>
      <Text className="text-[#999999] text-xs mt-1">
        {canteen.address
          ? `${canteen.address.street}, ${canteen.address.zipcode} ${canteen.address.city}`
          : 'Adresse nicht verfügbar'}
      </Text>
    </TouchableOpacity>
  );
}
