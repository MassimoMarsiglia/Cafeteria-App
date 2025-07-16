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
import { useSettings } from '@/hooks/redux/useSettings';
import { useSidebar } from '@/hooks/redux/useSidebar';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SidebarItem } from './SidebarItem/Index';

export const Sidebar = () => {
  const { toggleSidebar, sidebarState } = useSidebar();
  const { isDarkMode } = useSettings();
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
            <Heading size="lg">Schmausa</Heading>
            <Divider className="mt-2 divide-secondary-0" />
          </DrawerHeader>
          <DrawerBody>
            <Gerichte isDarkMode={isDarkMode} />
            <Mensen isDarkMode={isDarkMode} />
            <SavedChats isDarkMode={isDarkMode} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </SafeAreaView>
  );
};

const Mensen = ({ isDarkMode }: { isDarkMode: boolean }) => {
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
        color: isDarkMode ? 'white' : 'black',
      }}
      onPress={handlePress}
    />
  );
};

const Gerichte = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { favoriteCanteen } = useSettings();
  const { toggleSidebar } = useSidebar();

  const handlePress = () => {
    toggleSidebar();
    if (!favoriteCanteen) {
      router.replace({
        pathname: '/(tabs)/mensen/mensenList',
      });
      return;
    }
    router.replace({
      pathname: '/(tabs)/menu/[canteenId]',
      params: { canteenId: favoriteCanteen.id },
    });
  };
  return (
    <SidebarItem
      title="Heutige Gerichte"
      description="Aktuelle Speisen deiner Mensa"
      icon={MaterialCommunityIcons}
      iconProps={{
        name: 'food-fork-drink',
        size: 45,
        color: isDarkMode ? 'white' : 'black',
      }}
      onPress={handlePress}
    />
  );
};

const SavedChats = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const { toggleSidebar } = useSidebar();

  const handlePress = () => {
    toggleSidebar();
    router.replace({
      pathname: '/(tabs)/chatbot/MealListScreen',
    });
  };

  return (
    <SidebarItem
      title="Gespeicherte Rezepte"
      description="Lade gespeicherte Chatverläufe"
      icon={FontAwesome5}
      iconProps={{
        name: 'comments',
        size: 45,
        color: isDarkMode ? 'white' : 'black',
      }}
      onPress={handlePress}
    />
  );
};
