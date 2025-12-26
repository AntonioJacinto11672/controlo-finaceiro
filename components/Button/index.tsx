import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    // Define any props you want to pass to the Button component
    title: string;
    type?: 'PRIMARY' | 'SECONDARY';
    onPress?: () => void;
}
const Button = ({ title, type = 'PRIMARY', onPress }: ButtonProps) => {
    return (
        <TouchableOpacity className={`flex-1 min-h-16 max-h-16 py-5  rounded-md ${type === 'PRIMARY' ? 'bg-[#00875F]' : 'bg-[#AA2834]'} `} onPress={onPress}>
            <Text className='font-xl font-bold text-center text-white '> {title} </Text>
        </TouchableOpacity>
    );
} 

export default Button;
