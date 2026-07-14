import { HapticTab } from '@/components/haptic-tab';
import { Tabs } from 'expo-router';
import { CalendarXIcon, FileTextIcon, HouseIcon, UserIcon } from 'phosphor-react-native';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#f7931e',
        tabBarInactiveTintColor: '#7C7C8A',
        tabBarStyle: { backgroundColor: '#5f0221', borderTopColor: '#5f0221' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <HouseIcon color={color} size={size} weight="bold" />,
        }}
      />
      <Tabs.Screen
        name="faltas"
        options={{
          title: 'Faltas',
          tabBarIcon: ({ color, size }) => <CalendarXIcon color={color} size={size} weight="bold" />,
        }}
      />
      <Tabs.Screen
        name="declaracoes"
        options={{
          title: 'Declarações',
          tabBarIcon: ({ color, size }) => <FileTextIcon color={color} size={size} weight="bold" />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} weight="bold" />,
        }}
      />
    </Tabs>
  );
}
