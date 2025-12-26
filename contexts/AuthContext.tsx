import { UserType } from '@/utils/userType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: UserType;
  tokenLogeded: string;
  login: (userData: UserType, token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [tokenLogeded, setTokenLogeded] = useState<string>('');
  const [user, setUser] = useState<UserType>({
    id: '',
    email: '',
    userName: '',
    phoneNumber: '',
    roleId: '',
    password: ''
  });

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedToken) {
          setTokenLogeded(storedToken);
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
      }
    };

    loadAuthData();
  }, []);

  const login = async (userData: UserType, token: string) => {
    try {
      //Verificar se tem usuario  registado no localstorage
      
      console.log('User Info 2', userData);

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', token);

      setUser(userData);
      setTokenLogeded(token);
    } catch (error) {
      console.error('Erro ao salvar dados de login:', error);
    }
  };

  const logout = async () => {
    try {
      setUser({
        id: '',
        email: '',
        userName: '',
        phoneNumber: '',
        roleId: '',
        password: ''
      });
      setTokenLogeded('');

      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');

      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, tokenLogeded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
