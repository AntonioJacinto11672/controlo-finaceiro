import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { TouchableOpacity,  TouchableOpacityProps, View } from 'react-native';

export type ButtonIconStyleProps = "PRIMARY" | "SECONDARY"; 



type PropsIcons = {
    type: ButtonIconStyleProps;
}

type Props = TouchableOpacityProps &{
    icon: keyof typeof MaterialIcons.glyphMap;
    type?: ButtonIconStyleProps
}

const ButtonIcon = ({ icon, type = "PRIMARY", ...rest }: Props) => {
  return (
    <TouchableOpacity className='w-[56px] h-[56px] justify-center items-center ml-3' {...rest}>
      <MaterialIcons name={icon} size={24} color={type === "PRIMARY" ? "#00875F" : "#F75A68"} />
    </TouchableOpacity>
  );
}

export default ButtonIcon;
