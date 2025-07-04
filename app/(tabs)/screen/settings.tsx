import { RadioGroup } from '@/components/ui/radio';
import { RadioButton } from '@/components/Menu/RadioButton';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black px-4">
      <Text className="text-black dark:text-white text-xl font-bold mb-4">
        Einstellungen
      </Text>
      <View>
        <Text>Wähle deine Preisklasse</Text>
        <RadioGroup>
          <RadioButton label="Student"/>
          <RadioButton label="Angestellte"/>
          <RadioButton label="Gäste"/>
        </RadioGroup>
      </View>
      <View className="flex-row items-center justify-between w-full max-w-md">
        <Text className="text-black dark:text-white text-base">
          🌗 Dark Mode
        </Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>
    </View>
  );
}
