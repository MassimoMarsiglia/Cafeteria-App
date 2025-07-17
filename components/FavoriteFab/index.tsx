import { FontAwesome } from '@expo/vector-icons';
import { Fab } from '../ui/fab';

interface FavoriteFabProps {
  onPress: () => void;
  isFavorite: boolean;
  placement?:
    | 'bottom-right'
    | 'bottom-left'
    | 'top-right'
    | 'top-left'
    | 'top center'
    | 'bottom center';
}

export const FavoriteFab = (props: FavoriteFabProps) => {
  const favHeartIconProps = props.isFavorite ? (
    <FontAwesome name="heart" size={30} color="#FF6B6B" />
  ) : (
    <FontAwesome name="heart-o" size={30} color="gray" />
  );

  return <Fab onPress={props.onPress}>{favHeartIconProps}</Fab>;
};
