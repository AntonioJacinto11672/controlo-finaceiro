import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { tokenLogeded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simula carregamento até o AuthContext estar pronto
  useEffect(() => {
    // Aguarda 1 ciclo para garantir que o useEffect no AuthContext carregue os dados
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 100); // pode ajustar o tempo se necessário

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!tokenLogeded) {
    return <Redirect href="/(stack)/home" />;
  }

  return <Redirect href="/(stack)/home" />;
}