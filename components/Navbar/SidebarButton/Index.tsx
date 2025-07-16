import { Icon, MenuIcon } from '@/components/ui/icon';
import { useSidebar } from '@/hooks/redux/useSidebar';
import { Pressable } from 'react-native';

export const SidebarButton = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Pressable
      onPress={toggleSidebar}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      style={{ padding: 8 }}
    >
      <Icon as={MenuIcon} size="xl" />
    </Pressable>
  );
};
