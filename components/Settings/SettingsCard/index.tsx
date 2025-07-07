import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { ChevronRightIcon, Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Platform } from 'react-native';

interface Setting<T = any> {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode | (() => React.ReactNode);
  update: (val: T) => void;
  onPress: () => void;
  hasToggle?: boolean;
  value: T;
  Platforms?: string[];
}

interface SettingCardProps {
  setting: Setting;
}

export const SettingsCard = (props: SettingCardProps) => {
  // Check if the setting is applicable for the current platform
  if (
    props.setting.Platforms &&
    !props.setting.Platforms.includes(Platform.OS)
  ) {
    return;
  }
  // Render the settings card with the provided icon and setting details
  return (
    <Box className="bg-secondary-100 pt-4 px-4">
      <Box className="flex flex-row items-center gap-4 mb-2">
        <Box className="w-12 flex justify-center">
          {typeof props.setting.icon === 'function'
            ? props.setting.icon()
            : props.setting.icon}
        </Box>
        <Box className="flex-1">
          <Text className="text-typography-900 font-semibold">
            {props.setting.title}
          </Text>
          <Text className="text-typography-500 text-sm">
            {props.setting.description}
          </Text>
        </Box>
        <Box className="w-10 flex justify-center">
          {props.setting.hasToggle ? (
            <Switch
              value={props.setting.value}
              onValueChange={() => props.setting.update()}
            />
          ) : (
            <Icon as={ChevronRightIcon} className="text-typography-500" />
          )}
        </Box>
      </Box>
      <Divider orientation="horizontal" className="mt-2 mb-2" />
    </Box>
  );
};
