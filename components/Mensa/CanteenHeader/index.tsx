import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Address } from '@/services/mensaTypes';

interface CanteenHeaderProps {
  name: string;
  address: Address;
}

export const CanteenHeader = (props: CanteenHeaderProps) => {
  return (
    <Box className="flex-1 items-center justify-center p-4">
      <Text className="text-typography-900 text-2xl font-bold">
        {props.name}
      </Text>
      <Text className="text-typography-500 text-base mt-1">
        {props.address?.street}, {props.address?.zipcode} {props.address?.city}
      </Text>
    </Box>
  );
};
