import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { ChevronRightIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import React from 'react';
import { Platform } from 'react-native';

export interface Setting<T = any> {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode | (() => React.ReactNode);
  update?: () => void;
  onPress?: () => void;
  hasToggle?: boolean;
  value: T;
  Platforms?: string[];
}

interface SettingCardProps {
  setting: Setting;
}

export const SettingsCard = React.memo((props: SettingCardProps) => {
  // Check if the setting is applicable for the current platform
  if (
    props.setting.Platforms &&
    !props.setting.Platforms.includes(Platform.OS)
  ) {
    return null;
  }

  const content = (
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
              onValueChange={() => props.setting.update?.()}
            />
          ) : (
            <Icon as={ChevronRightIcon} className="text-typography-500" />
          )}
        </Box>
      </Box>
      <Divider orientation="horizontal" className="mt-2 mb-2" />
    </Box>
  );

  // Only wrap in Pressable if it's not a toggle (to avoid accessibility conflicts)
  if (props.setting.hasToggle) {
    return content;
  }

  return (
    <Pressable onPress={() => props.setting.onPress?.()}>{content}</Pressable>
  );
});

SettingsCard.displayName = 'SettingsCard';
