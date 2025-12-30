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

type RecoverPinFormData = {
  newPin: string;
};

const RecoverPinScreen = () => {
  const router = useRouter();
  const { recoverPin, isRegistered } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPinFormData>({
    defaultValues: {
      newPin: '',
    },
  });

  const onSubmit = async (data: RecoverPinFormData) => {
    if (!isRegistered) {
      Alert.alert(
        'Dispositivo não registado',
        'É necessário registar um utilizador primeiro.'
      );
      router.replace('/(auth)/register');
      return;
    }

    try {
      await recoverPin(data.newPin);

      Alert.alert(
        'Sucesso',
        'PIN alterado com sucesso. Faça login com o novo PIN.'
      );

      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error?.message || 'Não foi possível recuperar o PIN'
      );
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
          <Text className="text-gray-100 text-lg font-semibold text-center mb-4">
            Recuperar PIN
          </Text>

          {/* Novo PIN */}
          <Controller
            control={control}
            name="newPin"
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
                  errors.newPin ? 'outline outline-red-500' : ''
                }`}
                placeholder="Novo PIN (6 dígitos)"
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
          {errors.newPin && (
            <Text className="text-red-500 ml-2">
              {errors.newPin.message}
            </Text>
          )}

          {/* Botão recuperar */}
          <TouchableOpacity
            className="py-3 mt-6 bg-[#00665e] rounded-xl"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="font-bold text-center text-white">
              Atualizar PIN
            </Text>
          </TouchableOpacity>
        </View>

        {/* Voltar ao login */}
        <View className="flex-row justify-center mt-7">
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text className="font-semibold text-[#00665e]">
              Voltar ao Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RecoverPinScreen;
