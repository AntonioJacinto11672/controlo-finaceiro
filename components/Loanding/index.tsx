import { ActivityIndicator, View } from "react-native";

export default function Loading() {

    return (
        <View className="flex-1 justify-center items-center bg-[#380013]">
            <ActivityIndicator color={"#f7931e"} />
        </View>
    )
}