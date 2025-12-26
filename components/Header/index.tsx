import { useNavigation } from "@react-navigation/native";
import { CaretLeftIcon } from "phosphor-react-native";
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
type props = {
    showBackButton?: boolean;
}
const Header = ({ showBackButton = false }: props) => {
    const navigation = useNavigation()
    function handleGoback() {
        navigation.goBack();
    }
    return (
        <View className='w-full flex-row justify-center items-center'>

            {
                showBackButton &&
                <TouchableOpacity className='flex-1' onPress={handleGoback}>
                    <CaretLeftIcon color="white" size={32} />
                </TouchableOpacity>
            }

            <Image
                source={require("@/assets/images/logo/logo.png")}

                style={{ height: 55, width: 46 }}
            />
        </View>
    );
}

export default Header;
