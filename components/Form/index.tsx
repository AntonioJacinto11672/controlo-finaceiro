import theme_ignite from '@/constants/theme_ignite';
import React from 'react';
import { View } from 'react-native';

interface FormProps {
  children?: React.ReactNode;
}


const Form = ({ children }: FormProps) => {
  return (
    <View className={`w-full bg-[${theme_ignite.COLORS.GRAY_700}] flex-row justify-items-center rounded-md`}>
      {children}
    </View>
  );
}

export default Form;
