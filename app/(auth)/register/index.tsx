
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';



const RegisterScreen = () => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: "",
    },
  })

  const handleAddUser = async (data: any) => {
   console.log("Register data", data);
   Alert.alert("Registered successfully!");
  }

  return (
    <View className='flex-1 bg-white dark:bg-black' style={{ /* backgroundColor: "#00665e" */ }}>
      <SafeAreaView className='flex'>
        <View className='flex-row justify-start'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='bg-[#00665e] p-2 rounded-bl-2xl ml-4'
          >
            <ArrowLeftIcon size={20} color={"black"} />
          </TouchableOpacity>
        </View>

        <View className='flex-row justify-center'>
          <Image
            source={require("@/assets/images/logo/logo.png")}

            style={{ height: 150, width: 200 }}
          />
        </View>
      </SafeAreaView>

      <View className='flex-1 bg-white dark:bg-black px-8 pt-8'
        style={{
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50
        }}
      >
        <View className='form space-y-2'>
          {/* Email Input */}
          <Text className='text-gray-700 ml-4 mb-2 dark:text-gray-400'>Telefone </Text>
          <Controller
            control={control}
            rules={{
              required: "campo obrigatório",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput className={`p-4  bg-gray-100 text-gray-700 rounded-2xl  mb-4 ${errors.phoneNumber ? ' text-gray-100 outline outline-red-500' : ''}`}
                placeholder='Enter phone Number'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="phoneNumber"
          />
          {errors.phoneNumber && <Text className='text-red-500 text-small ml-2 mb-3'> {errors.phoneNumber.message} </Text>}


          <Text className='text-gray-700 ml-4 mb-2 dark:text-gray-400'>Email Address </Text>
          <Controller
            control={control}
            rules={{
              required: "campo obrigatório",
              pattern: {  // regex
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, // regex  para email
                message: "email inválido"
              },

            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput className={`p-4  bg-gray-100 text-gray-700 rounded-2xl mb-4 ${errors.email ? ' text-gray-100 outline outline-red-500' : ''}`}
                placeholder='Enter email' keyboardType='email-address'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
          />
          {errors.email && <Text className='text-red-500 text-small ml-2 mb-3'> {errors.email.message} </Text>}



          <Text className='text-gray-700 ml-4 mb-2 dark:text-gray-400'>Password </Text>
          <Controller
            control={control}
            rules={{
              required: "campo obrigatório",
              minLength: { value: 8, message: "mínimo de 8 caracteres" },
              pattern: {  // regex
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: "A senha deve ter pelo menos 8 caracteres, incluindo pelo menos uma letra e um número"
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput className={`p-4  bg-gray-100 text-gray-700 rounded-2xl mb-4  ${errors.password ? ' text-gray-100 outline outline-red-500' : ''}`}
                placeholder='Enter password'
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="password"
          />
          {errors.password && <Text className='text-red-500 text-small ml-2 mb-3'> {errors.password.message} </Text>}


          <TouchableOpacity className='py-3 mt-8 bg-[#00665e] rounded-xl' onPress={handleSubmit(handleAddUser)}>
            <Text className='font-xl font-bold text-center text-white'>Register</Text>
          </TouchableOpacity>
        </View>

        <Text className='text-xl text-gray-700 font-bold text-center py-5'>Or</Text>
        <View className='flex-row justify-center space-x-12 gap-x-2'>
        
                  <TouchableOpacity className='p-2 bg-gray-100 dark:bg-gray-900 rounded'>
                    <Image
                      source={require("@/assets/images/google.png")}
                      className='w-10 h-10'
                    />
                  </TouchableOpacity>
        
                  <TouchableOpacity className='p-2 bg-gray-100 dark:bg-gray-900 rounded'>
                    <Image
                      source={require("@/assets/images/facebook.png")}
                      className='w-10 h-10'
                    />
                  </TouchableOpacity>
        
                  <TouchableOpacity className='p-2 bg-gray-100 dark:bg-gray-900 rounded'>
                    <Image
                      source={require("@/assets/images/linkedin.png")}
                      className='w-10 h-10'
                    />
                  </TouchableOpacity>
        
                   <TouchableOpacity className='p-2 bg-gray-100 dark:bg-gray-900 rounded'>
                    <Image
                      source={require("@/assets/images/twitter.png")}
                      className='w-10 h-10'
                    />
                  </TouchableOpacity>
        
        
                </View>
        <View className='flex-row justify-center mt-7'>
          <Text className='text-gray-500 font-semibold'>Alread  have acount?</Text>
          <TouchableOpacity className='' onPress={() => { }}>
            <Text className='font-semibold text-[#00665e]'> Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default RegisterScreen;
