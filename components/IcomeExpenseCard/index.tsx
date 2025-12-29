import React from 'react';
import { Text, View } from 'react-native';
import ButtonIcon from '../ButtonIcon';


type Props = {
    name: string;
    value: number;
    onRemove: () => void;
}
const IcomeExpenseCard = ({ name, value, onRemove }: Props) => {
    return (
        <View className='w-full h-[60px] bg-[#29292E]  rounded-md flex-row items-center mb-[14px]'>
           {/*  <MaterialIcons name="text-snippet" size={24} color="#C4C4CC" className='ml-4 mr-1' /> */}
            <View className="flex-1 ml-4">
                <Text className=' text-base text-[#C4C4CC] ' style={{ fontFamily: 'Roboto_400Regular' }}>{name}</Text>
                <Text className="text-[#C4C4CC]  text-sm ">Valor: {value}</Text>
            </View>
            <ButtonIcon icon="close" type="SECONDARY" onPress={() => console.log("Delete Activity")} />
        </View>
    );
}

export default IcomeExpenseCard;
