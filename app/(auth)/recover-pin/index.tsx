import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const { recoverPin, isRegistered, user } = useAuth();

  const [sentCode, setSentCode] = useState<string | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<number | null>(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPinFormData>({
    defaultValues: {
      newPin: '',
    },
  });

  const sendCode = () => {
    if (!isRegistered) {
      Alert.alert(
        'Dispositivo não registado',
        'É necessário registar um utilizador primeiro.'
      );
      router.replace('/(auth)/register');
      return;
    }

    // Gera código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutos

    setSentCode(code);
    setCodeExpiresAt(expires);
    setEnteredCode('');
    setIsVerified(false);
    setCountdown(5 * 60);

    // Simula envio: para desenvolvimento mostramos o código ao utilizador
    console.log('Código (simulado) enviado por SMS:', code);
    Alert.alert('Código enviado', 'Um código de 6 dígitos foi enviado por SMS (simulado).');
  };

  const resendCode = () => {
    sendCode();
  };

  // Countdown para expiração do código
  useEffect(() => {
    if (!codeExpiresAt) return;

    const interval = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((codeExpiresAt - Date.now()) / 1000));
      setCountdown(seconds);

      if (seconds <= 0) {
        setSentCode(null);
        setCodeExpiresAt(null);
        setIsVerified(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [codeExpiresAt]);

  const verifyCode = () => {
    if (!sentCode) {
      Alert.alert('Nenhum código', 'Envie um código antes de verificar.');
      return;
    }

    if (enteredCode === sentCode) {
      setIsVerified(true);
      Alert.alert('Código verificado', 'Código correto. Pode definir o novo PIN.');
    } else {
      Alert.alert('Código inválido', 'Código incorreto. Tente novamente.');
    }
  };

  const onSubmit = async (data: RecoverPinFormData) => {
    if (!isRegistered) {
      Alert.alert(
        'Dispositivo não registado',
        'É necessário registar um utilizador primeiro.'
      );
      router.replace('/(auth)/register');
      return;
    }

    if (!isVerified) {
      Alert.alert('Verifique o código', 'Por favor verifique o código de 6 dígitos antes de alterar o PIN.');
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
        <View className="space-y-2 mx-2">
          <Text className="text-gray-100 text-lg font-semibold text-center mb-4">
            Recuperar PIN
          </Text>

          {codeExpiresAt && (
            <Text className="text-gray-400 text-center mb-3">
              Código expira em: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
            </Text>
          )}

          {/* Enviar código */}
          {!isVerified ? (
            <View>
              <Text className="text-gray-100 mb-2">Enviar código por SMS para o número registado{user?.phoneNumber ? `: ${user.phoneNumber}` : ''}</Text>

              <View className="flex-row space-x-2">
                {!sentCode ? (
                  <TouchableOpacity
                    className="flex-1 py-3 bg-[#00665e] rounded-xl mx-2"
                    onPress={sendCode}
                  >
                    <Text className="font-bold text-center text-white">Enviar código</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="flex-1 py-3 border border-[#00665e] rounded-xl mx-2"
                    onPress={resendCode}
                  >
                    <Text className="font-semibold text-center text-[#00665e]">Reenviar código</Text>
                  </TouchableOpacity>
                )}
              </View>

              {sentCode && (
                <View className="mt-3">
                  <Text className="text-yellow-300">Código SMS (simulado): {sentCode}</Text>

                  <View className="flex-row space-x-2 mt-3">
                    <TextInput
                      className="p-4 bg-[#121214] rounded-2xl text-gray-100 flex-1"
                      placeholder="Código (6 dígitos)"
                      placeholderTextColor="#7C7C8A"
                      keyboardType="numeric"
                      maxLength={6}
                      onChangeText={(text) => setEnteredCode(text.replace(/[^0-9]/g, ''))}
                      value={enteredCode}
                    />


                    <TouchableOpacity
                      className=" bg-[#00665e] rounded-xl mx-2 p-3"
                      onPress={verifyCode}
                    >
                      <Text className="font-bold text-white my-auto">Verificar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View className="mt-3">
              <Text className="text-green-400">Código verificado — agora pode definir o novo PIN.</Text>
            </View>
          )}

          {/* Novo PIN (só aparece depois de verificado) */}
          {isVerified && (
            <>
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
                <Text className="text-red-500 ml-2">{errors.newPin.message}</Text>
              )}

              <TouchableOpacity
                className="py-3 mt-6 bg-[#00665e] rounded-xl"
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="font-bold text-center text-white">Atualizar PIN</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Voltar ao login */}
        <View className="flex-row justify-center mt-7">
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text className="font-semibold text-[#00665e]">Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RecoverPinScreen;
