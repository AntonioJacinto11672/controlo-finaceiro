import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';



type Props = TouchableOpacityProps &{
    title: string;
    isActive?: boolean;
}

const Filter = ({ title, isActive, ...rest }: Props) => {
  return (
    <TouchableOpacity className={`mr-3 rounded h-[38px] min-w-[70px] px-3  items-center justify-center  ${isActive ? `border border-[#00875F] ` : ''}`} {...rest}>
      <Text className="text-white uppercase text-sm" style={{fontFamily: 'Roboto_700Bold'}} >{title}</Text>
    </TouchableOpacity>
  );
}

export default Filter;
