import { useSettings } from '@/hooks/redux/useSettings';
import { Address } from '@/services/mensaTypes';
import { Entypo } from '@expo/vector-icons';
import { Linking, Pressable } from 'react-native';

interface MapButtonProps {
  address: Address;
}

export const MapButton = (props: MapButtonProps) => {
  const { isDarkMode } = useSettings();

  const handleOpenMaps = () => {
    const address = `${props.address?.street}, ${props.address?.zipcode} ${props.address?.city}`;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.google.com/maps?q=${encodedAddress}`;
    Linking.openURL(url);
  };

  return (
    <Pressable onPress={handleOpenMaps} hitSlop={10}>
      <Entypo
        name="location-pin"
        size={24}
        color={isDarkMode ? 'white' : 'black'}
      />
    </Pressable>
  );
};
