import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { Canteen } from '@/services/mensaTypes';
import { NavigateToMenuButton } from './NavigateToMenuButton';

interface CanteenSelectionProps {
  canteen: Canteen;
}

export const CanteenSelection = (props: CanteenSelectionProps) => {
  return (
    <VStack className="w-full">
      <Divider
        orientation="horizontal"
        className="mb-5 mt-2 divide-background-100"
      />
      <Box className="w-full flex-row justify-between items-start">
        <NavigateToMenuButton canteenId={props.canteen.id} />
      </Box>
    </VStack>
  );
};
