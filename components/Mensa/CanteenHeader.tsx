import { Text } from 'react-native';

export default function CanteenHeader({
  name,
  address,
}: {
  name: string;
  address: any;
}) {
  return (
    <>
      <Text className="text-black dark:text-white text-2xl font-bold">
        {name}
      </Text>
      <Text className="text-gray-700 dark:text-gray-300 text-base mt-1">
        {address?.street}, {address?.zipcode} {address?.city}
      </Text>
    </>
  );
}
