import Loading from '@/components/Loanding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { tokenLogeded, isRegistered } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simula carregamento até o AuthContext estar pronto
  useEffect(() => {
    const clearAllStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log('Storage limpo com sucesso');
      } catch (error) {
        console.error('Erro ao limpar storage', error);
      }
    }
    //clearAllStorage()
    // Aguarda 1 ciclo para garantir que o useEffect no AuthContext carregue os dados
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // pode ajustar o tempo se necessário

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!isRegistered) {
    return <Redirect href="/(auth)/register" />
  }

  if (tokenLogeded) {
    return <Redirect href="/(stack)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}