import { Stack } from 'expo-router';
import React from 'react';

export default function AssiduidadeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Assiduidade' }} />
            <Stack.Screen name="justificar/[id]" options={{ title: 'Justificar falta' }} />
        </Stack>
    );
}
