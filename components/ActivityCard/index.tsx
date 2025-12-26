import { UsersThreeIcon } from 'phosphor-react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ActivityCardProps {
    Title: string;
    onPress?: () => void;
}

const ActivityCard = ({ Title, onPress }: ActivityCardProps) => {
    return (
        <TouchableOpacity className="w-full h-24 bg-[#29292E]  rounded-md flex-row items-center p-6 mb-3" onPress={onPress}>
            <UsersThreeIcon size={32} color="#00875F" weight='fill' style={{ marginRight: 20 }} />
            <Text className="text-base text-gray-200" style={{ fontFamily: "Roboto_700Bold" }}>{Title}</Text>
        </TouchableOpacity>
    );
}

export default ActivityCard;
