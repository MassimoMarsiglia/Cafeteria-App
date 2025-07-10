import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { ChevronRightIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Pressable } from 'react-native';

interface SidebarItemProps {
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
  iconProps?: any;
  onPress: () => void;
}

export const SidebarItem = (props: SidebarItemProps) => {
  return (
    <Pressable onPress={props.onPress} className="mt-5 mb-5">
      <Box className="flex-row items-center">
        <Box className="p-1 rounded mr-3">
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
      <Divider className="mt-5" />
    </Pressable>
  );
};
