import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { ArrowRightIcon, ChevronRightIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Pressable } from 'react-native';

interface SidebarItemProps {
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
  iconProps?: any;
  onPress?: () => void;
}

export const SidebarItem = (props: SidebarItemProps) => {
  return (
    <Pressable>
      <Box className="flex-row items-center">
        <Box className="mr-3">
          <props.icon {...props.iconProps} />
        </Box>
        <Box className="flex-1 flex-col">
          <Heading size="sm" className="font-bold">
            {props.title}
          </Heading>
          <Box>
            <Box className="text-lg">{props.title}</Box>
            {props.description && (
              <Text className="text-sm text-gray-500">{props.description}</Text>
            )}
          </Box>
        </Box>
        <Icon as={ChevronRightIcon} />
      </Box>
    </Pressable>
  );
};
