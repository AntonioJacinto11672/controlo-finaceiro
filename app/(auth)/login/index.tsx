import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { AppError } from '@/utils/AppError';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoginFormData = {
  identificador: string;
};

const LoginScreen = () => {
  const router = useRouter();
  const { solicitarCodigo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      identificador: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await solicitarCodigo(data.identificador.trim());
      router.push({
        pathname: '/(auth)/verify-code',
        params: { identificador: data.identificador.trim() },
      });
    } catch (error: any) {
      Alert.alert('Erro', error instanceof AppError ? error.message : 'Não foi possível enviar o código.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#202024]">
      <SafeAreaView className="flex">
        <View className="flex-row justify-center">
          <Image
            source={require('@/assets/images/logotipos/6.png')}
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
        <Text className="text-[#AA2834] text-lg font-semibold text-center mb-2">
          TCL RH
        </Text>
        <Text className="text-gray-400 text-center mb-6">
          Introduza o seu número de agente ou email para receber um código de acesso
        </Text>

        <View className="space-y-2">
          <Controller
            control={control}
            name="identificador"
            rules={{ required: 'Campo obrigatório' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Número de agente ou email"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.identificador && (
            <Text className="text-red-500 ml-2 mb-3">{errors.identificador.message}</Text>
          )}

          <Button
            title={isLoading ? 'A enviar...' : 'Enviar código'}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
