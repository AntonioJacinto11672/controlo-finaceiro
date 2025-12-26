import React from 'react';
import { Text, View } from 'react-native';

interface HighlihtProps {
    title: string;
    subTitle: string;
}

const Highliht = ({ title, subTitle }: HighlihtProps) => {
  return (
    <View className='w-full my-8 mx-0'>
      <Text className='text-2xl font-bold text-white text-center'>{title}</Text>
      <Text className="text-base font-medium text-zinc-700 text-center">{subTitle}</Text>
    </View>
  );
}

export default Highliht;
