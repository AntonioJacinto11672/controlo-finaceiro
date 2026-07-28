import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='login/index' options={{ headerShown: false, title: "Login" }} />
            <Stack.Screen name='verify-code/index' options={{ headerShown: false, title: "Verificar código" }} />
        </Stack>
    );
}
