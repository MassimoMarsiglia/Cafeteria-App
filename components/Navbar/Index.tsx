import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '../ui/box';
import { Divider } from '../ui/divider';
import { Icon, SettingsIcon } from '../ui/icon';
import { Text } from '../ui/text';
import { Sidebar } from '../Sidebar/Index';
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
          <Icon as={SettingsIcon} size="md" />
        </Box>
        <Sidebar />
      </Box>
      <Divider />
    </SafeAreaView>
  );
};
