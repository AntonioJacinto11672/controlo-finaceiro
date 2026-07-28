import { authService } from '@/services/auth.service';
import { clearToken, getToken, setToken } from '@/services/api';
import { Funcionario } from '@/services/types';
import { AUTH_COLLECTION } from '@/storage/storageConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface AuthContextType {
  funcionario: Funcionario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  solicitarCodigo: (numero_agente: string, email: string) => Promise<string>;
  verificarCodigo: (numero_agente: string, email: string, codigo: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const FUNCIONARIO_KEY = `${AUTH_COLLECTION}-funcionario`;
const LAST_ACTIVE_KEY = `${AUTH_COLLECTION}-lastActive`;
const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutos em segundo plano

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const backgroundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carrega sessão persistida ao iniciar a app
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [token, storedFuncionario, lastActive] = await Promise.all([
          getToken(),
          AsyncStorage.getItem(FUNCIONARIO_KEY),
          AsyncStorage.getItem(LAST_ACTIVE_KEY),
        ]);

        if (!token || !storedFuncionario) {
          setIsLoading(false);
          return;
        }

        if (lastActive) {
          const elapsed = Date.now() - Number(lastActive);
          if (elapsed > INACTIVITY_MS) {
            await clearSession();
            setIsLoading(false);
            return;
          }
        }

        setFuncionario(JSON.parse(storedFuncionario));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Bloqueio automático: se a app ficar em segundo plano mais de INACTIVITY_MS, força novo login
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState !== 'active') {
        AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString()).catch(() => {});

        if (backgroundTimer.current) clearTimeout(backgroundTimer.current);
        backgroundTimer.current = setTimeout(async () => {
          backgroundTimer.current = null;
          await clearSession();
          setIsAuthenticated(false);
          setFuncionario(null);
        }, INACTIVITY_MS);
      } else {
        if (backgroundTimer.current) {
          clearTimeout(backgroundTimer.current);
          backgroundTimer.current = null;
        }
        AsyncStorage.removeItem(LAST_ACTIVE_KEY).catch(() => {});

        getToken().then((token) => {
          if (!token) {
            setIsAuthenticated(false);
            setFuncionario(null);
            router.replace('/(auth)/login');
          }
        });
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [router]);

  async function clearSession() {
    await clearToken();
    await AsyncStorage.multiRemove([FUNCIONARIO_KEY, LAST_ACTIVE_KEY]);
  }

  async function solicitarCodigo(numero_agente: string, email: string): Promise<string> {
    const { message } = await authService.solicitarCodigo(numero_agente, email);
    return message;
  }

  async function verificarCodigo(numero_agente: string, email: string, codigo: string): Promise<void> {
    const { access_token, funcionario: dados } = await authService.verificarCodigo(numero_agente, email, codigo);

    await setToken(access_token);
    await AsyncStorage.setItem(FUNCIONARIO_KEY, JSON.stringify(dados));

    setFuncionario(dados);
    setIsAuthenticated(true);
    router.replace('/(stack)/pedidos');
  }

  async function logout(): Promise<void> {
    if (backgroundTimer.current) {
      clearTimeout(backgroundTimer.current);
      backgroundTimer.current = null;
    }
    await clearSession();
    setFuncionario(null);
    setIsAuthenticated(false);
    router.replace('/(auth)/login');
  }

  return (
    <AuthContext.Provider
      value={{ funcionario, isAuthenticated, isLoading, solicitarCodigo, verificarCodigo, logout }}
    >
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
