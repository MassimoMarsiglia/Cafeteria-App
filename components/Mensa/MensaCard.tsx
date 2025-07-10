import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { getImageForCanteen } from '@/utils/imageMap';
import { TouchableOpacity } from 'react-native';

export default function CanteenCard({
  canteen,
  onPress,
}: {
  canteen: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="bg-secondary-100 p-4 rounded-lg mb-2.5"
      onPress={onPress}
    >
      <Image
        source={getImageForCanteen(canteen.name)}
        className="w-full h-[150px] rounded-lg mb-2.5 bg-[#333]"
        resizeMode="cover"
        alt="All canteen images"
      />
      <Text className="text-black dark:text-white text-base font-semibold">
        {canteen.name}
      </Text>
      <Text className="text-gray-700 dark:text-[#cccccc] text-sm">
        {canteen.city} – {(canteen.distance / 1000).toFixed(2)} km entfernt
      </Text>
      {/* In the case that we want to fully make the line disappear if there is no location allow */}
      {/* <Text className="text-gray-700 dark:text-[#cccccc] text-sm">
        {canteen.city}
        {typeof canteen.distance === 'number' && !isNaN(canteen.distance) ? ` – ${(canteen.distance / 1000).toFixed(2)} km entfernt` : ''}
        </Text> */}
      <Text className="text-black dark:text-[#999999] text-xs mt-1">
        {canteen.address
          ? `${canteen.address.street}, ${canteen.address.zipcode} ${canteen.address.city}`
          : 'Adresse nicht verfügbar'}
      </Text>
    </TouchableOpacity>
  );
}
