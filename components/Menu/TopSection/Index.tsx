import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';

export const TopSection = () => {
  return (
    <Box className="p-4 mb-4">
      <Text className="font-bold text-lg">Heutige Gerichte</Text>
      <Text className="text-sm text-gray-500">HTW Mensa</Text>
    </Box>
  );
};
