import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

type LoginFormData = {
  numero_agente: string;
  email: string;
};

const LoginScreen = () => {
  const router = useRouter();
  const { solicitarCodigo } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { numero_agente: '', email: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setApiError('');
      await solicitarCodigo(data.numero_agente.trim(), data.email.trim());
      router.push({
        pathname: '/(auth)/verify-code',
        params: { numero_agente: data.numero_agente.trim(), email: data.email.trim() },
      });
    } catch (error: any) {
      const message = error?.message || 'Nao foi possivel enviar o codigo de acesso.';
      setApiError(message);
      Alert.alert('Erro', message);
    } finally {
      setIsSubmitting(false);
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
        <Text className="text-gray-100 text-lg font-semibold text-center mb-6">
          Acesso RH
        </Text>

        <View className="space-y-2">
          <Controller
            control={control}
            name="numero_agente"
            rules={{ required: 'Campo obrigatorio' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`p-4 bg-[#121214] rounded-2xl text-gray-100 mb-1 ${
                  errors.numero_agente ? 'outline outline-red-500' : ''
                }`}
                placeholder="Numero de agente"
                placeholderTextColor="#7C7C8A"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={(text) => {
                  setApiError('');
                  onChange(text);
                }}
                value={value}
              />
            )}
          />
          {errors.numero_agente && (
            <Text className="text-red-500 ml-2 mb-2">{errors.numero_agente.message}</Text>
          )}

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Campo obrigatorio',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email invalido' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`p-4 bg-[#121214] rounded-2xl text-gray-100 mb-1 ${
                  errors.email ? 'outline outline-red-500' : ''
                }`}
                placeholder="Email"
                placeholderTextColor="#7C7C8A"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={(text) => {
                  setApiError('');
                  onChange(text);
                }}
                value={value}
              />
            )}
          />
          {errors.email && <Text className="text-red-500 ml-2">{errors.email.message}</Text>}

          {apiError ? (
            <Text className="text-red-400 text-center mt-3">{apiError}</Text>
          ) : null}

          <TouchableOpacity
            className="py-3 mt-6 bg-[#00665e] rounded-xl flex-row justify-center items-center"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-bold text-center text-white">Enviar codigo de acesso</Text>
            )}
          </TouchableOpacity>

          <Text className="text-gray-500 text-center mt-4 text-xs">
            Vais receber um codigo de 6 digitos por email para confirmar o acesso.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
