import { SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

interface SearchbarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const Searchbar = (props: SearchbarProps) => {
  return (
    <Input className="bg-secondary-100 w-full rounded-lg mb-3 h-12 shadow">
      <InputSlot className="pl-2">
        <InputIcon as={SearchIcon} />
      </InputSlot>
      <InputField
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
      />
    </Input>
  );
};
