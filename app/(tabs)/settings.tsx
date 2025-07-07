import { RadioGroup } from '@/components/ui/radio';
import { RadioButton } from '@/components/Menu/RadioButton';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSettings } from '@/hooks/redux/useSettings';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const { setPriceCategory, priceCategory } = useSettings();
  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setColorScheme]);

  return (
    <View className="flex-1 items-center justify-center bg-background-0 px-4">
      <Text className="text-black dark:text-white text-xl font-bold mb-4">
        Einstellungen
      </Text>
      <View>
        <Text>Wähle deine Preisklasse</Text>
        <RadioGroup onChange={setPriceCategory} value={priceCategory}>
          <RadioButton value="0" label="Student"/>
          <RadioButton value="1" label="Angestellte"/>
          <RadioButton value="2" label="Gäste"/>
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
