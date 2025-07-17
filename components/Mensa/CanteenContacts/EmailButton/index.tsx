import { Pressable } from '@/components/ui/pressable';
import { useSettings } from '@/hooks/redux/useSettings';
import { ContactInfo } from '@/services/mensaTypes';
import { Entypo } from '@expo/vector-icons';
import { Linking } from 'react-native';

interface EmailButtonProps {
  contactInfo: ContactInfo;
}

export const EmailButton = (props: EmailButtonProps) => {
  const { isDarkMode } = useSettings();

  const handleOpenMail = () => {
    if (props.contactInfo?.email) {
      Linking.openURL(`mailto:${props.contactInfo.email}`);
    }
  };

  return (
    <Pressable onPress={handleOpenMail}>
      <Entypo name="mail" size={24} color={isDarkMode ? 'white' : 'black'} />
    </Pressable>
  );
};
