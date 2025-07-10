import { Box } from '@/components/ui/box';
import { Icon, SettingsIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { router } from 'expo-router';

export const Settingsbutton = () => {
  return (
    <Box className="w-8 items-end">
      <Pressable
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={() => router.push({ pathname: '/(tabs)/settings' })}
      >
        <Icon as={SettingsIcon} size="md" />
      </Pressable>
    </Box>
  );
};
