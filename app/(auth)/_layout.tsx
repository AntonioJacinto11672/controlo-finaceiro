import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    return (
        
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='login/index' options={{ headerShown: false, title: "login" }} />
            <Stack.Screen name='register/index' options={{ headerShown: false, title: "Register" }} />
        </Stack>
    );
}
