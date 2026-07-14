import AuthService from '@/services/api/authService';
import FuncionarioService from '@/services/api/funcionarioService';
import { clearToken, getToken, saveToken } from '@/services/tokenStorage';
import { Funcionario } from '@/types/funcionario';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  funcionario: Funcionario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  solicitarCodigo: (identificador: string) => Promise<void>;
  verificarCodigo: (identificador: string, codigo: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const authService = new AuthService();
const funcionarioService = new FuncionarioService();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Ao arrancar: se houver token guardado, valida-o a carregar o perfil
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await getToken();
        if (token) {
          const perfil = await funcionarioService.obterMeuPerfil();
          setFuncionario(perfil);
        }
      } catch (error) {
        // token inválido/expirado
        await clearToken();
        setFuncionario(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // 📨 PASSO 1 — pede o envio do código de acesso por email
  const solicitarCodigo = async (identificador: string) => {
    await authService.solicitarCodigo(identificador);
  };

  // 🔑 PASSO 2 — valida o código e inicia sessão
  const verificarCodigo = async (identificador: string, codigo: string) => {
    const { access_token, funcionario: perfil } = await authService.verificarCodigo(identificador, codigo);
    await saveToken(access_token);
    setFuncionario(perfil);
    router.replace('/(tabs)');
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await clearToken();
    setFuncionario(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider
      value={{
        funcionario,
        isLoading,
        isAuthenticated: !!funcionario,
        solicitarCodigo,
        verificarCodigo,
        logout,
      }}
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
