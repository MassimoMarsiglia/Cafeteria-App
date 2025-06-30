import { Text, View } from 'react-native';

export default function CanteenContact({ contactInfo }: { contactInfo: any }) {
  if (!contactInfo) return null;

  return (
    <View className="w-full mt-5">
      <Text className="text-black dark:text-white text-lg font-bold mb-2">
        Kontaktinformationen:
      </Text>

      {contactInfo.phone && (
        <View className="flex-row items-center bg-green-300 dark:bg-green-800 px-4 py-2 rounded-lg mb-3">
          <Text className="text-gray-800 dark:text-gray-200 text-lg">
            📞 {contactInfo.phone}
          </Text>
        </View>
      )}

      {contactInfo.email && (
        <View className="flex-row items-center bg-blue-300 dark:bg-blue-800 px-4 py-2 rounded-lg mb-3">
          <Text className="text-gray-800 dark:text-gray-200 text-lg">
            📧 {contactInfo.email}
          </Text>
        </View>
      )}
    </View>
  );
}
