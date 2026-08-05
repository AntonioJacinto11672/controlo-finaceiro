import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function StackLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#00875F',
                tabBarInactiveTintColor: '#7C7C8A',
                tabBarStyle: { backgroundColor: '#202024', borderTopColor: '#29292E' },
            }}
        >
            <Tabs.Screen
                name="pedidos"
                options={{
                    title: 'Pedidos',
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="assignment" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="assiduidade"
                options={{
                    title: 'Assiduidade',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="event-available" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="perfil/index"
                options={{
                    title: 'Perfil',
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
