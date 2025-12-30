import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoginFormData = {
  password: string; // PIN 6 dígitos
};

const LoginScreen = () => {
  const router = useRouter();
  const { loginWithPin, isRegistered } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!isRegistered) {
      Alert.alert(
        'Dispositivo não registado',
        'Por favor, faça o registo primeiro.'
      );
      router.replace('/(auth)/register');
      return;
    }

    const success = await loginWithPin(data.password);

    if (!success) {
      Alert.alert('Erro', 'PIN incorreto. Tente novamente.');
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
        <View className="space-y-2">
          {/* PIN */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Campo obrigatório',
              minLength: {
                value: 6,
                message: 'PIN deve conter 6 dígitos',
              },
              maxLength: {
                value: 6,
                message: 'PIN deve conter 6 dígitos',
              },
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Apenas números (6 dígitos)',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`p-4 bg-[#121214] rounded-2xl text-gray-100 ${
                  errors.password ? 'outline outline-red-500' : ''
                }`}
                placeholder="PIN (6 dígitos)"
                placeholderTextColor="#7C7C8A"
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                onBlur={onBlur}
                onChangeText={(text) =>
                  onChange(text.replace(/[^0-9]/g, ''))
                }
                value={value}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 ml-2">
              {errors.password.message}
            </Text>
          )}

          {/* Recuperar PIN */}
          <TouchableOpacity
            className="flex items-end mb-5"
            onPress={() => {router.push('/(auth)/recover-pin')}}
          >
            <Text className="text-gray-400">Forgot PIN?</Text>
          </TouchableOpacity>

          {/* Login */}
          <TouchableOpacity
            className="py-3 bg-[#00665e] rounded-xl"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="font-bold text-center text-white">
              Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Registo */}
       {/*  <View className="flex-row justify-center mt-7">
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
          >
            <Text className="font-semibold text-[#00665e]">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default LoginScreen;
