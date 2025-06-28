import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '../ui/box';
import { Divider } from '../ui/divider';
import { Icon, SettingsIcon } from '../ui/icon';
import { Text } from '../ui/text';
import { Sidebar } from './Sidebar/Index';
import { SidebarButton } from './Sidebar/SidebarButton/Index';

export const Navbar = () => {
  return (
    <SafeAreaView className="bg-background-0">
      <Box className="flex-row items-center justify-between p-4 bg-background-0">
        <Box className="w-8 items-start">
          <SidebarButton />
        </Box>
        <Text className="text-lg font-bold flex-1 text-center">Schmausa</Text>
        <Box className="w-8 items-end">
          <Icon as={SettingsIcon} size="md" />
        </Box>
        <Sidebar />
      </Box>
      <Divider className="mt-2" />
    </SafeAreaView>
  );
};
