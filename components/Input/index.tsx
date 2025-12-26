import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

const Input = ({ ...rest }: TextInputProps) => {
    return (
        <TextInput
            {...rest}
            className="flex-1 min-h-[56px] max-h-[56px] bg-[#121214] text-white font-lg rounded-md p-4 mb-3"
            style={{ fontFamily: 'Roboto_400Regular' }}
            placeholderTextColor={"#7C7C8A"}
        />
    );
}

export default Input;
