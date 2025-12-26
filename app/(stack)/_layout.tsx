import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    return (
        
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='home/index' options={{ headerShown: false, title: "Home" }} />
            <Stack.Screen name='newActivity/index' options={{ headerShown: false, title: "Nova Actividade" }} />
            <Stack.Screen name='activity/index' options={{ headerShown: false, title: "Actividades" }} />
        </Stack>
    );
}
