import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Text, View } from 'react-native';
import ButtonIcon from '../ButtonIcon';


type Props = {
    name: string;
    onRemove: () => void;
}
const IcomeExpenseCard = ({ name, onRemove }: Props) => {
    return (
        <View className='w-full h-[56px] bg-[#29292E]  rounded-md flex-row items-center mb-[14px]'>
            <MaterialIcons name="person" size={24} color="#C4C4CC" className='ml-4 mr-1' />
            <Text className='flex-1 text-base text-[#C4C4CC] ' style={{ fontFamily: 'Roboto_400Regular' }}>{name}</Text>
            <ButtonIcon icon="close" type="SECONDARY" onPress={() => console.log("Delete Activity")} />
        </View>
    );
}

export default IcomeExpenseCard;
