import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { UserType } from '@/utils/userType';
import { useAuth } from '@/contexts/AuthContext';

type RegisterFormData = {
  email: string;
  password: string; // PIN 6 dígitos
  phoneNumber: string;
};

const RegisterScreen = () => {
  const router = useRouter();
  const { register } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      phoneNumber: '',
    },
  });

  const handleAddUser = async (data: RegisterFormData) => {
    try {
      const userData: UserType = {
        id: Date.now().toString(),
        email: data.email,
        phoneNumber: data.phoneNumber,
        userName: data.email.split('@')[0],
        roleId: 'USER',
        password: '', // não usamos password tradicional
      };

      await register(userData, data.password);

      Alert.alert(
        'Sucesso',
        'Utilizador registado com sucesso. Faça login com o PIN.'
      );
    } catch (error: any) {
      Alert.alert(
        'Erro no registo',
        error?.message || 'Não foi possível registar'
      );
    }
  };

  return (
    <View className="flex-1 bg-[#202024]">
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#00665e] p-2 rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
        </View>

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
        <View className="space-y-2">
          {/* Telefone */}
          <Text className="text-gray-100 ml-4 mb-2">Telefone</Text>
          <Controller
            control={control}
            name="phoneNumber"
            rules={{ required: 'campo obrigatório' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`p-4 bg-[#121214] rounded-2xl mb-4 text-gray-100 ${
                  errors.phoneNumber ? 'outline outline-red-500' : ''
                }`}
                placeholder="Enter phone number"
                placeholderTextColor="#7C7C8A"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.phoneNumber && (
            <Text className="text-red-500 ml-2">
              {errors.phoneNumber.message}
            </Text>
          )}

          {/* Email */}
          <Text className="text-gray-100 ml-4 mb-2">Email</Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'campo obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'email inválido',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`p-4 bg-[#121214] rounded-2xl mb-4 text-gray-100 ${
                  errors.email ? 'outline outline-red-500' : ''
                }`}
                placeholder="Enter email"
                placeholderTextColor="#7C7C8A"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 ml-2">
              {errors.email.message}
            </Text>
          )}

          {/* PIN */}
          <Text className="text-gray-100 ml-4 mb-2">PIN (6 dígitos)</Text>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'campo obrigatório',
              minLength: { value: 6, message: 'PIN deve ter 6 dígitos' },
              maxLength: { value: 6, message: 'PIN deve ter 6 dígitos' },
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Apenas números (6 dígitos)',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`p-4 bg-[#121214] rounded-2xl mb-4 text-gray-100 ${
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

          <TouchableOpacity
            className="py-3 mt-8 bg-[#00665e] rounded-xl"
            onPress={handleSubmit(handleAddUser)}
          >
            <Text className="font-bold text-center text-white">
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-7">
          <Text className="text-gray-500 font-semibold">
            Already have account?
          </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text className="font-semibold text-[#00665e]"> Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
