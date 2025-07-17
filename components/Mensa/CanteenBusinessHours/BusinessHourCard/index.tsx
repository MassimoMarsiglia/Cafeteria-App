import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

interface BusinessHourCardProps {
  day: string;
  hours: string[];
}

export const BusinessHourCard = ({ day, hours }: BusinessHourCardProps) => {
  return (
    <Card className="bg-secondary-100 mb-2 mt-2 p-4 rounded-lg w-full">
      <Text className="text-blue-800 dark:text-blue-300 font-semibold text-base mb-2">
        📅 {day}
      </Text>
      {hours.length > 0 ? (
        hours.map((hour, index) => (
          <Text key={index} className="text-typography-500">
            {hour}
          </Text>
        ))
      ) : (
        <Text className="text-typography-500">Geschlossen</Text>
      )}
    </Card>
  );
};
