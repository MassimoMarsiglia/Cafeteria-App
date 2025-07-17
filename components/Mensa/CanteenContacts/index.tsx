import { Box } from '@/components/ui/box';
import { Address, ContactInfo } from '@/services/mensaTypes';
import { EmailButton } from './EmailButton';
import { MapButton } from './MapButton';
import { PhoneButton } from './PhoneButton';

interface CanteenContactProps {
  address: Address;
  contactInfo: ContactInfo;
}

export const CanteenContacts = (props: CanteenContactProps) => {
  return (
    <Box className="flex-row items-center py-4 justify-between w-full px-8">
      <MapButton address={props.address} />
      <PhoneButton contactInfo={props.contactInfo} />
      <EmailButton contactInfo={props.contactInfo} />
    </Box>
  );
};
