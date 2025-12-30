import React from 'react';
import { Text, View } from 'react-native';
import ButtonIcon from '../ButtonIcon';


type Props = {
    name: string;
    value: number;
    onRemove: () => void;
    type?: 'receitas' | 'despesas' | string;
}
const IcomeExpenseCard = ({ name, value, onRemove, type }: Props) => {
    const color = type === 'receitas' ? '#00B37E' : type === 'despesas' ? '#FF4D4F' : '#C4C4CC';

    const formatValue = (v: number) => {
        try {
            return `AKZ ${new Intl.NumberFormat('pt-PT').format(v)}`;
        } catch (e) {
            return `AKZ ${v}`;
        }
    }

    return (
        <View className='w-full h-[60px] bg-[#29292E]  rounded-md flex-row items-center mb-[14px]'>
            <View style={{ width: 6, height: 36, borderRadius: 6, backgroundColor: color }} className='ml-4 mr-3' />
            <View className="flex-1">
                <Text className=' text-base text-[#C4C4CC] ' style={{ fontFamily: 'Roboto_400Regular' }}>{name}</Text>
                <Text className="text-[#C4C4CC]  text-sm ">Valor: <Text style={{ color }}>{formatValue(value)}</Text></Text>
            </View>
            <ButtonIcon icon="close" type="SECONDARY" onPress={onRemove} />
        </View>
    );
}

export default IcomeExpenseCard;
