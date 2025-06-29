import { Divider } from '@/components/ui/divider';
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { useSidebar } from '@/hooks/redux/useSidebar';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SidebarItem } from './SidebarItem/Index';

export const Sidebar = () => {
  const { toggleSidebar, sidebarState } = useSidebar();
  return (
    <SafeAreaView>
      <Drawer
        isOpen={sidebarState.isOpen}
        onClose={toggleSidebar}
        size="lg"
        anchor="left"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader className="flex flex-col items-start justify-center mt-4">
            <Heading size="lg">Schmausa App</Heading>
            <Divider className="mt-2 divide-secondary-0" />
          </DrawerHeader>
          <DrawerBody>
            <Gerichte />
            <Mensen />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </SafeAreaView>
  );
};

const Mensen = () => {
  const { toggleSidebar } = useSidebar();

  const handlePress = () => {
    toggleSidebar();
    router.replace({
         pathname: '/(tabs)/mensen/mensenList',
    });
  };
  return (
    <SidebarItem
      title="Mensen"
      description="Alle Mensen in deiner Nähe"
      icon={FontAwesome5}
      iconProps={{
        name: 'building',
        size: 45,
        className: 'text-primary-500',
      }}
      onPress={handlePress}
    />
  );
};

const Gerichte = () => {
  const { toggleSidebar } = useSidebar();

  const handlePress = () => {
    toggleSidebar();
    router.replace({
      pathname: '/(tabs)/menu/[canteenId]',
      params: { canteenId: '655ff175136d3b580c970f80' },
    });
  };
  return (
    <SidebarItem
      title="Heutige Gerichte"
      description="Aktuelle Speisen der Mensa"
      icon={MaterialCommunityIcons}
      iconProps={{
        name: 'food-fork-drink',
        size: 45,
        className: 'text-primary-500',
      }}
      onPress={handlePress}
    />
  );
};
