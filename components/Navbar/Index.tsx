import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sidebar } from '../Sidebar/Index';
import { Box } from '../ui/box';
import { Divider } from '../ui/divider';
import { Icon, SettingsIcon } from '../ui/icon';
import { Pressable } from '../ui/pressable';
import { Text } from '../ui/text';
import { SidebarButton } from './SidebarButton/Index';

export const Navbar = () => {
  return (
    <SafeAreaView edges={['top']} className="bg-background-0">
      <Box className="flex-row items-center justify-between px-4 py-1 bg-background-0">
        <Box className="w-8 items-start">
          <SidebarButton />
        </Box>

        <Text className="text-lg font-bold flex-1 text-center">Schmausa</Text>

        <Box className="w-8 items-end">
          <Pressable
            onPress={() => router.push({ pathname: '/(tabs)/settings' })}
          >
            <Icon as={SettingsIcon} size="md" />
          </Pressable>
        </Box>

        <Sidebar />
      </Box>
      <Divider />
    </SafeAreaView>
  );
};
