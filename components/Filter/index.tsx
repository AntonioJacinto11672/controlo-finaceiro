import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';



type Props = TouchableOpacityProps &{
    title: string;
    isActive?: boolean;
}

const Filter = ({ title, isActive, ...rest }: Props) => {
  return (
    <TouchableOpacity className={`mr-3 rounded h-[38px] min-w-[70px] px-3  items-center justify-center  ${isActive ? `border border-[#f7931e] ` : ''}`} {...rest}>
      <Text className="text-[#f7931e] uppercase text-sm" style={{fontFamily: 'Roboto_700Bold'}} >{title}</Text>
    </TouchableOpacity>
  );
}

export default Filter;
