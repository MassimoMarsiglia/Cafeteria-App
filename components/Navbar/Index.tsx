import { usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sidebar } from '../Sidebar/Index';
import { Box } from '../ui/box';
import { Divider } from '../ui/divider';
import { Text } from '../ui/text';
import { Settingsbutton } from './Settingsbutton';
import { SidebarButton } from './SidebarButton/Index';

export const Navbar = () => {
  const pathname = usePathname();

  // Hide Navbar on homepage
  if (pathname === '/') {
    return null;
  }

  return (
    <SafeAreaView edges={['top']} className="bg-background-0">
      <Box className="flex-row items-center justify-between px-4 py-1 bg-background-0 my-1">
        <SidebarButton />

        <Text className="text-2xl font-bold flex-1 text-center">Schmausa</Text>

        <Settingsbutton />

        <Sidebar />
      </Box>
      <Divider />
    </SafeAreaView>
  );
};
