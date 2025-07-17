import { Fab } from '@/components/ui/fab';
import { Ionicons } from '@expo/vector-icons';

interface GenerateFabProps {
  onPress: () => void;
  placement?:
    | 'bottom right'
    | 'bottom left'
    | 'top right'
    | 'top left'
    | 'top center'
    | 'bottom center';
}

export const GenerateFab = ({ onPress, placement }: GenerateFabProps) => {
  return (
    <Fab placement={placement} onPress={onPress}>
      <Ionicons name="sparkles" size={40} color="#FBC02D" />
    </Fab>
  );
};
