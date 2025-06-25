import { TouchableOpacity } from 'react-native';
import { Box } from './ui/box';
import { Text } from './ui/text';

export const MealCard = ({
    item: meal,
    index,
}: {
    item: any;
    index: number;
}) => {
    return (
        <TouchableOpacity>
            <Box className="bg-primary-500 p-5">
                <Text className="text-typography-0">This is the Box</Text>
            </Box>
        </TouchableOpacity>
    );
};
