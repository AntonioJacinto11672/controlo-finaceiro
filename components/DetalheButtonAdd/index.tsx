import { PlusIcon } from 'phosphor-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface DetalheButtonAddProps {
    eyeOpen: boolean;
    title: string;
    value: number;
    onPressAdd: () => void;
}
const DetalheButtonAdd = ({ eyeOpen, title, value, onPressAdd }: DetalheButtonAddProps) => {
    return (
        <View className='flex-row items-center py-2'>

            <View className='flex-1'>
                <Text className='text-md text-white'>{title}</Text>
                <Text className='text-white'>AKZ {eyeOpen ? value : '***'},00</Text>
            </View>

            <TouchableOpacity className='h-[40] w-[45] bg-green-700 rounded-md items-center justify-center' onPress={onPressAdd} >
                <Text className="">
                    <PlusIcon size={20} color="white" />
                </Text>
            </TouchableOpacity>

        </View>
    );
}

export default DetalheButtonAdd;
