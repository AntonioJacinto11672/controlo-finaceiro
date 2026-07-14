import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

const Input = ({ ...rest }: TextInputProps) => {
    return (
        <TextInput
            {...rest}
            className="flex-1 min-h-[56px] max-h-[56px] bg-[#380013] text-[#f7931e] font-lg rounded-md p-4 mb-3"
            style={{ fontFamily: 'Roboto_400Regular' }}
            placeholderTextColor={"rgba(247,147,30,0.45)"}
        />
    );
}

export default Input;
