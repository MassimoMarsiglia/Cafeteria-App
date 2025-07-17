import { Fab } from '@/components/ui/fab';
import { useSettings } from '@/hooks/redux/useSettings';
import { MaterialIcons } from '@expo/vector-icons';

interface MenuFabProps {
  onPress?: () => void;
  placement?:
    | 'bottom right'
    | 'bottom left'
    | 'top right'
    | 'top left'
    | 'top center'
    | 'bottom center';
}

export const MenuFab = (props: MenuFabProps) => {
  const { isDarkMode } = useSettings();
  return (
    <Fab onPress={props.onPress} placement={props.placement}>
      <MaterialIcons
        name="menu-book"
        size={30}
        color={isDarkMode ? 'black' : 'white'}
      />
    </Fab>
  );
};
