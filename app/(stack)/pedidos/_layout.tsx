import { Stack } from 'expo-router';
import React from 'react';

export default function PedidosLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: 'Pedidos' }} />
            <Stack.Screen name="novo" options={{ title: 'Novo pedido' }} />
            <Stack.Screen name="nova-declaracao" options={{ title: 'Nova declaração' }} />
            <Stack.Screen name="[id]" options={{ title: 'Detalhe do pedido' }} />
        </Stack>
    );
}
