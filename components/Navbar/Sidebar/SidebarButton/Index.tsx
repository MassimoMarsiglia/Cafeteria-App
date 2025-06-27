import { Icon, MenuIcon } from '@/components/ui/icon';
import { Pressable } from 'react-native';

interface SidebarButtonProps {
  onPress: () => void;
}

export const SidebarButton = (props: SidebarButtonProps) => {
  return (
    <Pressable
      onPress={props.onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{ padding: 8 }}
    >
      <Icon as={MenuIcon} size="md" />
    </Pressable>
  );
};
