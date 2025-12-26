import { ActivityIndicator, View } from "react-native";

export default function Loading() {

    return (
        <View className="flex-1 justify-center items-center bg-[#202024]">
            <ActivityIndicator color={"#00875F"} />
        </View>   
    )
}