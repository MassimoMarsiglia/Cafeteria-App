import { Icon, MenuIcon } from '@/components/ui/icon';
import { useSidebar } from '@/hooks/redux/useSidebar';
import { Pressable } from 'react-native';

export const SidebarButton = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Pressable
      onPress={toggleSidebar}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{ padding: 8 }}
    >
      <Icon as={MenuIcon} size="md" />
    </Pressable>
  );
};
