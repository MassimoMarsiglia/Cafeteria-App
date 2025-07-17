import { Pressable } from '@/components/ui/pressable';
import { useSettings } from '@/hooks/redux/useSettings';
import { ContactInfo } from '@/services/mensaTypes';
import { AntDesign } from '@expo/vector-icons';
import { Linking } from 'react-native';

interface PhoneButtonProps {
  contactInfo: ContactInfo;
}

export const PhoneButton = (props: PhoneButtonProps) => {
  const { isDarkMode } = useSettings();

  const handleOpenPhone = () => {
    if (props.contactInfo?.phone) {
      Linking.openURL(`tel:${props.contactInfo.phone}`);
    }
  };

  return (
    <Pressable onPress={handleOpenPhone} hitSlop={10}>
      <AntDesign
        name="phone"
        size={24}
        color={isDarkMode ? 'white' : 'black'}
      />
    </Pressable>
  );
};
