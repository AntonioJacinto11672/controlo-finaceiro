import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { AppError } from '@/utils/AppError';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type VerifyCodeFormData = {
  codigo: string;
};

const COOLDOWN_SEGUNDOS = 60;

const VerifyCodeScreen = () => {
  const router = useRouter();
  const { identificador } = useLocalSearchParams<{ identificador: string }>();
  const { verificarCodigo, solicitarCodigo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(COOLDOWN_SEGUNDOS);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    defaultValues: { codigo: '' },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data: VerifyCodeFormData) => {
    try {
      setIsLoading(true);
      await verificarCodigo(identificador, data.codigo);
    } catch (error: any) {
      Alert.alert('Erro', error instanceof AppError ? error.message : 'Código inválido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReenviar = async () => {
    try {
      await solicitarCodigo(identificador);
      setCooldown(COOLDOWN_SEGUNDOS);
      Alert.alert('Código reenviado', 'Verifique o seu email.');
    } catch (error: any) {
      Alert.alert('Erro', error instanceof AppError ? error.message : 'Não foi possível reenviar o código.');
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
        style={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
      >
        <Text className="text-gray-100 text-lg font-semibold text-center mb-2">
          Verificar código
        </Text>
        <Text className="text-gray-400 text-center mb-6">
          Enviámos um código de 6 dígitos para o email associado a {identificador}
        </Text>

        <View className="space-y-2">
          <Controller
            control={control}
            name="codigo"
            rules={{
              required: 'Campo obrigatório',
              pattern: { value: /^[0-9]{6}$/, message: 'O código deve ter 6 dígitos' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Código de 6 dígitos"
                keyboardType="numeric"
                maxLength={6}
                onBlur={onBlur}
                onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                value={value}
              />
            )}
          />
          {errors.codigo && <Text className="text-red-500 ml-2 mb-3">{errors.codigo.message}</Text>}

          <Button
            title={isLoading ? 'A verificar...' : 'Confirmar'}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <View className="flex-row justify-center mt-7">
          <TouchableOpacity onPress={handleReenviar} disabled={cooldown > 0}>
            <Text className={cooldown > 0 ? 'text-gray-500' : 'font-semibold text-[#00665e]'}>
              {cooldown > 0 ? `Reenviar código (${cooldown}s)` : 'Reenviar código'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VerifyCodeScreen;
