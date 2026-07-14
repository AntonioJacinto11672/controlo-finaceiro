import React from 'react';
import { Text, View } from 'react-native';

type ListEmpityProps = {
    message: string;
}

const ListEmpity = ({ message }: ListEmpityProps) => {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-center text-base text-[#f7931e]/60' style={{fontFamily: "Roboto_400Regular"}}>{message}</Text>
    </View>
  );
}

export default ListEmpity;
