import { Searchbar } from '@/components/Mensa/Searchbar';
import { SettingsCard } from '@/components/Settings/SettingsCard';
import { Box } from '@/components/ui/box';
import { Icon, MoonIcon, SunIcon } from '@/components/ui/icon';
import { useSettings } from '@/hooks/redux/useSettings';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { View } from 'react-native';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, setPriceCategory, priceCategory } =
    useSettings();
  const [search, setSearch] = useState('');

  // Define settings items
  const allSettings = [
    {
      id: 'theme',
      icon: () => {
        return isDarkMode !== 'dark' ? (
          <Icon as={MoonIcon} className="text-typography-900" />
        ) : (
          <Icon as={SunIcon} className="text-typography-900" />
        );
      },
      title: 'Dunkler Modus',
      description: 'Zwischen hellem und dunklem Theme wechseln',
      category: 'Darstellung',
      value: isDarkMode === 'dark' ? true : false,
      update: toggleDarkMode,
      onPress: () => {
        toggleDarkMode();
      },
      hasToggle: true,
    },
    {
      id: 'price',
      icon: () => <FontAwesome5 name="money-bill" size={24} color={isDarkMode === "dark" ? "white" : "black"} />,
      title: 'Preiskategorie',
      description: 'Student, Mitarbeiter oder Gast Preise',
      category: 'Preise',
      value: priceCategory,
      update: setPriceCategory,
      onPress: () => {},
      hasToggle: false,
    },
  ];

  // Filter settings based on search
  const filteredSettings = allSettings.filter(
    setting =>
      setting.title.toLowerCase().includes(search.toLowerCase()) ||
      setting.description.toLowerCase().includes(search.toLowerCase()) ||
      setting.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View className="bg-background-0 h-full px-4 pt-4">
      <Box className="mt-3">
        <Searchbar
          onChangeText={setSearch}
          value={search}
          placeholder="Suche nach Einstellungen."
        />

        <Box className="rounded-md">
          {filteredSettings.map(setting => (
            <SettingsCard key={setting.id} setting={setting} />
          ))}
        </Box>
      </Box>
    </View>
  );
}
