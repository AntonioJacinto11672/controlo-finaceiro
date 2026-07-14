import { Stack } from 'expo-router';
import React from 'react';

export default function FaltasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Faltas' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalhe da falta' }} />
    </Stack>
  );
}
