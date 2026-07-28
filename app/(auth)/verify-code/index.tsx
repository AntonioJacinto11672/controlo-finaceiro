import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CODE_VALIDITY_SECONDS = 10 * 60;

const VerifyCodeScreen = () => {
  const router = useRouter();
  const { solicitarCodigo, verificarCodigo } = useAuth();
  const params = useLocalSearchParams<{ numero_agente: string; email: string }>();
  const numero_agente = params.numero_agente ?? '';
  const email = params.email ?? '';

  const [codigo, setCodigo] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(CODE_VALIDITY_SECONDS);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const expired = countdown <= 0;

  const handleResend = async () => {
    try {
      setIsResending(true);
      await solicitarCodigo(numero_agente, email);
      setCodigo('');
      setCountdown(CODE_VALIDITY_SECONDS);
      Alert.alert('Código reenviado', 'Um novo código de acesso foi enviado para o teu email.');
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível reenviar o código.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    if (codigo.length !== 6) {
      Alert.alert('Código incompleto', 'Introduz o código de 6 dígitos.');
      return;
    }
    try {
      setIsVerifying(true);
      await verificarCodigo(numero_agente, email, codigo);
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Código inválido ou expirado.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View className="flex-1 bg-[#202024]">
      <SafeAreaView className="flex">
        <View className="flex-row justify-center">
          <Image
            source={require('@/assets/images/logo/logo.png')}
            style={{ height: 150, width: 200 }}
          />
        </View>
      </SafeAreaView>

      <View
        className="flex-1 bg-[#29292E] px-8 pt-8"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <View className="space-y-2 mx-2">
          <Text className="text-gray-100 text-lg font-semibold text-center mb-2">
            Verificar código
          </Text>
          <Text className="text-gray-400 text-center mb-4">
            Enviámos um código de 6 dígitos para {email || 'o teu email'}
          </Text>

          <Text className={`text-center mb-3 ${expired ? 'text-red-400' : 'text-gray-400'}`}>
            {expired
              ? 'O código expirou. Pede um novo código.'
              : `Código expira em: ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}`}
          </Text>

          <TextInput
            className="p-4 bg-[#121214] rounded-2xl text-gray-100 text-center text-2xl tracking-[8px]"
            placeholder="000000"
            placeholderTextColor="#7C7C8A"
            keyboardType="numeric"
            maxLength={6}
            editable={!expired}
            onChangeText={(text) => setCodigo(text.replace(/[^0-9]/g, ''))}
            value={codigo}
          />

          <TouchableOpacity
            className="py-3 mt-6 bg-[#00665e] rounded-xl flex-row justify-center items-center"
            onPress={handleVerify}
            disabled={isVerifying || expired}
          >
            {isVerifying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-bold text-center text-white">Verificar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 mt-3 border border-[#00665e] rounded-xl flex-row justify-center items-center"
            onPress={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <ActivityIndicator color="#00665e" />
            ) : (
              <Text className="font-semibold text-center text-[#00665e]">Reenviar código</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-7">
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text className="font-semibold text-[#00665e]">Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VerifyCodeScreen;
