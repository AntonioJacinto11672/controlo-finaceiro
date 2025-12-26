import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <SafeAreaView className={`flex-1 bg-[#202024] p-6`}>
            {children}
        </SafeAreaView>
    );
}

export default Container;
