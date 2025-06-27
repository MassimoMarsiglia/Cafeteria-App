import { Box } from '@/components/ui/box';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SidebarItem } from './SidebarItem/Index';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = (props: SidebarProps) => {
  return (
    <SafeAreaView>
      <Drawer
        isOpen={props.isOpen}
        onClose={props.onClose}
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </SafeAreaView>
  );
};

const Gerichte = () => {
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
    />
  );
};
