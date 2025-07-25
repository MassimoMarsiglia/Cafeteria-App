import { Searchbar } from '@/components/Mensa/Searchbar';
import { Setting, SettingsCard } from '@/components/Settings/SettingsCard';
import { Box } from '@/components/ui/box';
import { Icon, MoonIcon, SunIcon } from '@/components/ui/icon';
import { useSettings } from '@/hooks/redux/useSettings';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, priceCategory, favoriteCanteen } =
    useSettings();
  const { colorScheme } = useColorScheme();
  const [search, setSearch] = useState('');

  const iconColor = colorScheme === 'dark' ? 'white' : 'black';

  const handleFavoriteCanteenPress = useCallback(() => {
    const imageKey = favoriteCanteen?.name
      .replace(/^mensa/i, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '');
    router.navigate({
      pathname: '/mensen/mensenDetail/[canteenId]',
      params: {
        canteenId: favoriteCanteen?.id || '',
        imageKey: imageKey || '',
      },
    });
  }, [favoriteCanteen?.id, favoriteCanteen?.name]);

  const handlePriceCategoryPress = useCallback(() => {
    router.navigate({
      pathname: '/settings/pricecategory',
    });
  }, []);

  const handleFavoriteMealsPress = useCallback(() => {
    console.log('Navigating to favorite meals');
    router.navigate({
      pathname: '/settings/favoritemeals',
    });
  }, []);

  const themeIcon = useMemo(
    () =>
      colorScheme !== 'dark' ? (
        <Icon as={MoonIcon} className="text-typography-900" size="xl" />
      ) : (
        <Icon as={SunIcon} className="text-typography-900" size="xl" />
      ),
    [colorScheme],
  );

  const priceIcon = useMemo(
    () => <FontAwesome5 name="money-bill" size={20} color={iconColor} />,
    [iconColor],
  );

  const favoriteMealsIcon = useMemo(
    () => <MaterialIcons name="fastfood" size={20} color={iconColor} />,
    [iconColor],
  );

  const mensaIcon = useMemo(
    () => <FontAwesome5 name="building" size={20} color={iconColor} />,
    [iconColor],
  );

  // Define settings items with memoization
  const allSettings: Setting[] = useMemo(
    () => [
      {
        id: 'theme',
        icon: themeIcon,
        title: 'Dunkler Modus',
        description: 'Zwischen hellem und dunklem Theme wechseln',
        category: 'Darstellung',
        value: isDarkMode,
        update: toggleDarkMode,
        hasToggle: true,
      },
      {
        id: 'price',
        icon: priceIcon,
        title: 'Preiskategorie',
        description: 'Student, Mitarbeiter oder Gast Preise',
        category: 'Preise',
        value: priceCategory,
        onPress: handlePriceCategoryPress,
        hasToggle: false,
      },
      {
        id: 'favorite canteen',
        title: 'Lieblings Mensa',
        description: 'Deine Lieblingsmensa anzeigen',
        category: 'Mensa',
        icon: mensaIcon,
        value: favoriteCanteen,
        hasToggle: false,
        onPress: handleFavoriteCanteenPress,
      },
      {
        id: 'favorite meals',
        title: 'Lieblingsgerichte',
        description: 'Deine Lieblingsgerichte verwalten',
        category: 'Gerichte',
        icon: favoriteMealsIcon,
        value: undefined,
        hasToggle: false,
        onPress: handleFavoriteMealsPress,
      },
    ],
    [
      isDarkMode,
      priceCategory,
      themeIcon,
      priceIcon,
      toggleDarkMode,
      handlePriceCategoryPress,
      handleFavoriteCanteenPress,
      mensaIcon,
      favoriteCanteen,
      favoriteMealsIcon,
      handleFavoriteMealsPress,
    ],
  );

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

        <Box className="rounded-3xl overflow-hidden shadow-md">
          {filteredSettings.map((setting, index) => (
            <SettingsCard
              key={setting.id}
              setting={setting}
              isLast={index === filteredSettings.length - 1}
            />
          ))}
        </Box>
      </Box>
    </View>
  );
}
