import { Radio, RadioGroup, RadioIndicator, RadioLabel, RadioIcon } from "@/components/ui/radio";
import { CircleIcon } from "@/components/ui/icon";
	
export const RadioButton = ({
  label,
}: {
  label: string;
}) => {
  return (
    <Radio value="change" size="md" isInvalid={false} isDisabled={false}>
      <RadioIndicator>
        <RadioIcon as={CircleIcon} />
      </RadioIndicator>
      <RadioLabel>{label}</RadioLabel>
    </Radio>
  );
};