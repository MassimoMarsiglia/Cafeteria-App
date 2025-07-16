import { Box } from '@/components/ui/box';
import { Icon, SettingsIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { router } from 'expo-router';

export const Settingsbutton = () => {
  return (
    <Box className="w-8 items-end">
      <Pressable
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        onPress={() => router.navigate({ pathname: '/(tabs)/settings' })}
      >
        <Icon as={SettingsIcon} size="xl" />
      </Pressable>
    </Box>
  );
};
