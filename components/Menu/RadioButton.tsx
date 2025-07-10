import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';

interface RadioButtonProps {
  label: string;
  value: string;
  isInvalid?: boolean;
}

export const RadioButton = (props: RadioButtonProps) => {
  return (
    <Radio value={props.value} size="md" isInvalid={false} isDisabled={false}>
      <RadioIndicator>
        <RadioIcon as={CircleIcon} />
      </RadioIndicator>
      <RadioLabel>{props.label}</RadioLabel>
    </Radio>
  );
};
