import { Stack } from 'expo-router';
import React from 'react';

export default function DeclaracoesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Declarações' }} />
      <Stack.Screen name="nova" options={{ title: 'Nova solicitação' }} />
    </Stack>
  );
}
