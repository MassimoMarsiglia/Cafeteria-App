import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { ChevronRightIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Pressable } from 'react-native';
import { toggleSidebar } from '@/store/slices/sidebarSlice';
import { useSidebar } from '@/hooks/redux/useSidebar';

interface SidebarItemProps {
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
  iconProps?: any;
  onPress: () => void;
}

export const SidebarItem = (props: SidebarItemProps) => {
  const { toggleSidebar } = useSidebar();

  const handleReroute = () => {
    props.onPress();
  };

  return (
    <Pressable onPress={handleReroute} className="mt-5 mb-5">
      <Box className="flex-row items-center">
        <Box className="mr-3">
          <props.icon {...props.iconProps} />
        </Box>
        <Box className="flex-1 flex-col">
          <Heading size="sm" className="font-bold">
            {props.title}
          </Heading>
          {props.description && (
            <Text className="text-sm text-gray-500">{props.description}</Text>
          )}
        </Box>
        <Icon as={ChevronRightIcon} />
      </Box>
    </Pressable>
  );
};
