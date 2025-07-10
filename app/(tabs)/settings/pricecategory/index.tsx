import { Setting, SettingsCard } from '@/components/Settings/SettingsCard';
import { Box } from '@/components/ui/box';
import { useSettings } from '@/hooks/redux/useSettings';
import { FontAwesome5, Fontisto } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';

const PriceCategory = () => {
  const { priceCategory, setPriceCategory, isDarkMode } = useSettings();

  // Optimize with useCallback to prevent recreation on every render
  const handleStudentPress = useCallback(() => {
    if (Number(priceCategory) !== 0) {
      setPriceCategory('0');
    }
  }, [priceCategory, setPriceCategory]);

  const handleEmployeePress = useCallback(() => {
    if (Number(priceCategory) !== 1) {
      setPriceCategory('1');
    }
  }, [priceCategory, setPriceCategory]);

  const handleGuestPress = useCallback(() => {
    if (Number(priceCategory) !== 2) {
      setPriceCategory('2');
    }
  }, [priceCategory, setPriceCategory]);

  // Memoize the icons to prevent recreation
  const studentIcon = useMemo(
    () => (
      <Fontisto
        name="person"
        className="text-typography-900"
        size={20}
        color={isDarkMode ? 'white' : 'black'}
      />
    ),
    [isDarkMode],
  );

  const employeeIcon = useMemo(
    () => (
      <FontAwesome5
        name="chalkboard-teacher"
        className="text-typography-900"
        color={isDarkMode ? 'white' : 'black'}
        size={20}
      />
    ),
    [isDarkMode],
  );

  const guestIcon = useMemo(
    () => (
      <FontAwesome5
        name="user-friends"
        className="text-typography-900"
        color={isDarkMode ? 'white' : 'black'}
        size={20}
      />
    ),
    [isDarkMode],
  );

  const categories: Setting[] = useMemo(
    () => [
      {
        title: 'Student',
        description: 'Preise für Studierende',
        id: 'student',
        icon: studentIcon,
        category: 'Preiskategorie',
        value: Number(priceCategory) === 0,
        update: handleStudentPress,
        hasToggle: true,
      },
      {
        title: 'Mitarbeiter',
        description: 'Preise für Mitarbeiter',
        id: 'employee',
        icon: employeeIcon,
        category: 'Preiskategorie',
        value: Number(priceCategory) === 1,
        hasToggle: true,
        update: handleEmployeePress,
      },
      {
        title: 'Gast',
        description: 'Preise für Gäste',
        id: 'guest',
        icon: guestIcon,
        category: 'Preiskategorie',
        value: Number(priceCategory) === 2,
        hasToggle: true,
        update: handleGuestPress,
      },
    ],
    [
      priceCategory,
      handleStudentPress,
      handleEmployeePress,
      handleGuestPress,
      studentIcon,
      employeeIcon,
      guestIcon,
    ],
  );

  return (
    <View className="bg-background-0 h-full px-4 pt-4">
      <Box className="bg-secondary-100 rounded-3xl pt-4 px-4">
        {categories.map(category => (
          <SettingsCard key={category.id} setting={category} />
        ))}
      </Box>
    </View>
  );
};

export default PriceCategory;
