import { AUTH_COLLECTION } from '@/storage/storageConfig';
import { UserType } from '@/utils/userType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';


interface AuthContextType {
  user: UserType;
  tokenLogeded: string;
  isRegistered: boolean;
  register: (userData: UserType, pin: string) => Promise<void>;
  loginWithPin: (pin: string) => Promise<boolean>;
  recoverPin: (newPin: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const INITIAL_USER: UserType = {
  id: '',
  email: '',
  userName: '',
  phoneNumber: '',
  roleId: '',
  password: ''
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<UserType>(INITIAL_USER);
  const [tokenLogeded, setTokenLogeded] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // Background timeout (auto logout if app is backgrounded for > 20s)
  const backgroundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const INACTIVITY_MS = 20 * 1000; // 20 seconds
  const LAST_ACTIVE_KEY = `${AUTH_COLLECTION}-lastActive`;

  // 🔄 Carregar dados ao iniciar app
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(
          `${AUTH_COLLECTION}-user`
        );
        const storedToken = await AsyncStorage.getItem(
          `${AUTH_COLLECTION}-token`
        );
        const lastActive = await AsyncStorage.getItem(LAST_ACTIVE_KEY);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsRegistered(true);
        }

        if (storedToken) {
          // if we have a last active timestamp, check if it expired while app was closed/killed
          if (lastActive) {
            const elapsed = Date.now() - Number(lastActive);
            if (elapsed > INACTIVITY_MS) {
              // expired while app was closed; remove token
              await AsyncStorage.removeItem(`${AUTH_COLLECTION}-token`);
              await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
              setTokenLogeded('');
            } else {
              setTokenLogeded(storedToken);
            }
          } else {
            setTokenLogeded(storedToken);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar autenticação:', error);
      }
    };

    loadAuthData();
  }, []);

  // Listen for AppState changes to detect when app goes to background
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      // when moving to background or inactive, store timestamp and start a timeout that expires the token
      if (nextState !== 'active') {
        AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString()).catch(() => {});

        if (backgroundTimer.current) {
          clearTimeout(backgroundTimer.current as any);
          backgroundTimer.current = null;
        }

        backgroundTimer.current = setTimeout(async () => {
          try {
            await AsyncStorage.removeItem(`${AUTH_COLLECTION}-token`);
            await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
          } catch (e) {
            // ignore
          }

          backgroundTimer.current = null;
          setTokenLogeded('');
        }, INACTIVITY_MS);
      } else {
        // app became active: clear timer, remove lastActive and ensure token still valid
        if (backgroundTimer.current) {
          clearTimeout(backgroundTimer.current as any);
          backgroundTimer.current = null;
        }
        AsyncStorage.removeItem(LAST_ACTIVE_KEY).catch(() => {});

        // if token was removed by timeout while in background, force navigation to login
        AsyncStorage.getItem(`${AUTH_COLLECTION}-token`).then(storedToken => {
          if (!storedToken) {
            setTokenLogeded('');
            router.replace('/(auth)/login');
          }
        }).catch(() => {});
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);

    return () => sub.remove();
  }, []);

  // 📝 REGISTO ÚNICO (UMA VEZ POR DISPOSITIVO)
  const register = async (userData: UserType, pin: string) => {
    try {
      const alreadyRegistered = await AsyncStorage.getItem(
        `${AUTH_COLLECTION}-user`
      );

      if (alreadyRegistered) {
        throw new Error('Já existe um utilizador registado neste dispositivo');
      }

      if (!/^[0-9]{6}$/.test(pin)) {
        throw new Error('O PIN deve conter exatamente 6 dígitos');
      }

      await AsyncStorage.multiSet([
        [`${AUTH_COLLECTION}-user`, JSON.stringify(userData)],
        [`${AUTH_COLLECTION}-pin`, pin]
      ]);

      setUser(userData);
      setIsRegistered(true);

      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Erro no registo:', error);
      throw error;
    }
  };

  // 🔑 LOGIN APENAS COM PIN (6 DÍGITOS)
  const loginWithPin = async (pin: string) => {
    try {
      const storedPin = await AsyncStorage.getItem(
        `${AUTH_COLLECTION}-pin`
      );

      if (storedPin !== pin) {
        return false;
      }

      const token = Date.now().toString();

      await AsyncStorage.setItem(
        `${AUTH_COLLECTION}-token`,
        token
      );

      setTokenLogeded(token);

      // clear any recorded last active time and cancel background timer
      await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
      if (backgroundTimer.current) {
        clearTimeout(backgroundTimer.current as any);
        backgroundTimer.current = null;
      }

      router.replace('/(stack)/home');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  // 🔄 RECUPERAÇÃO DE PIN
  const recoverPin = async (newPin: string) => {
    if (!/^[0-9]{6}$/.test(newPin)) {
      throw new Error('O novo PIN deve conter exatamente 6 dígitos');
    }

    await AsyncStorage.setItem(
      `${AUTH_COLLECTION}-pin`,
      newPin
    );
  };

  // 🚪 LOGOUT (não apaga registo)
  const logout = async () => {
    try {
      // cancel background timer and remove lastActive marker
      if (backgroundTimer.current) {
        clearTimeout(backgroundTimer.current as any);
        backgroundTimer.current = null;
      }
      await AsyncStorage.removeItem(LAST_ACTIVE_KEY);

      await AsyncStorage.removeItem(
        `${AUTH_COLLECTION}-token`
      );

      setTokenLogeded('');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokenLogeded,
        isRegistered,
        register,
        loginWithPin,
        recoverPin,
        logout
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
