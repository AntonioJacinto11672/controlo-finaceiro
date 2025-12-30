
import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Input from '@/components/Input';
import Loading from '@/components/Loanding';
import ActivityService from '@/storage/activity.service';
import EspecificActivityService from '@/storage/especificactivity.service';
import { AppError } from '@/utils/AppError';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import { nanoid } from 'nanoid/non-secure';
import { FileTextIcon } from 'phosphor-react-native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Keyboard, Platform, Pressable, Text } from 'react-native';
const data = [
  { id: '1', title: 'Atividade 1' },
  { id: '2', title: 'Atividade 2' },
  { id: '3', title: 'Atividade 3' },
]

type RouteParams = {
  value: string
}



const createActivity = () => {

  const route = useRoute();
  const [titulo, setTitulo] = React.useState('');
  const [subtitulo, setSubtitulo] = React.useState('');
  const { value } = route.params as RouteParams;
  const [showPicker, setShowPicker] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      value: "",
      dataActivity: new Date(),
    },
  })

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      const actvityModel = new ActivityService();
      const especificActivityModel = new EspecificActivityService();

      const id = nanoid();
      if (value.includes("Actividade")) {

        const newActivity = {
          id: id,
          name: data.name,
          value: Number(data.value),
          dataActivity: data.dataActivity,
          createAt: new Date(),
        };

        const result = await actvityModel.addActivity(newActivity);
        Alert.alert("Actividade", "Atividade criada com sucesso!");
        router.back();
        return;
      } else {
        //console.log("Criando uma nova receita ou despesas");

        const newActivity = {
          id: id,
          idActivity: subtitulo,
          name: data.name,
          value: Number(data.value),
          dataActivity: data.dataActivity,
          type: titulo.toLowerCase() === 'receitas' ? 'receitas' : 'despesas',
          createAt: new Date(),
        };
        const correnteActivity = await actvityModel.getActivityById(subtitulo);

        if (!correnteActivity) {
          Alert.alert("Actividade", "Atividade principal não encontrada!");
          return;
        }

        if (((newActivity.value > correnteActivity.value))) {
          Alert.alert("Actividade", "O valor da atividade não pode ser maior que o valor da atividade principal!");
          return;
        }


        const result = await especificActivityModel.addEspecificActivity(newActivity);
        console.log("result: ", result);
        if (result && result != undefined) {
          Alert.alert("Actividade", "Atividade criada com sucesso!");
          router.back();
        }
      }
      Keyboard.dismiss()
    } catch (error) {
      console.log("Error ", error);

      if (error instanceof AppError) {

        Alert.alert("Novo Actividade", error.message)

      } else {
        Alert.alert("Novo Actividade", "Não foi Possível criar novo Actividade!")
      }
      console.log(error);
    }
    finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    const partes = value.split("_");
    const tituloExtraido = partes.shift();
    const subtituloExtraido = partes.join("_");

    setTitulo(tituloExtraido || '');
    setSubtitulo(subtituloExtraido || '');
  }, [value]);





  return (
    <Container>
      {
        isLoading ?
          <Loading /> :
          <>
            <Header showBackButton />
            <FileTextIcon color="#00875F" size={56} style={{ alignSelf: "center" }} />
            <Highliht
              title={`Nova ${titulo}` || "Nova Actividade"}
              subTitle={`Adicionara ${titulo} para controlar os gastos` || "Cria uma actividade para controlar seus gastos"}
            />

            <Controller
              control={control}
              rules={{
                required: "campo obrigatório",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className={`p-4  bg-[#121214] text-gray-700 rounded-2xl  ${errors.name ? ' text-gray-100 outline outline-red-500' : ''}`}
                  placeholder='Enter name'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ marginTop: 32, marginBottom: 16 }}
                />
              )}
              name="name"
            />
            {errors.name && <Text className='text-red-500 text-small ml-2 mb-5'> {errors.name.message} </Text>}

            <Controller
              control={control}
              rules={{
                required: "campo obrigatório",
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Só é permitido números',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input className={`p-4  bg-[#121214] text-gray-700 rounded-2xl  ${errors.value ? ' text-gray-100 outline outline-red-500' : ''}`}
                  placeholder='Enter value'
                  keyboardType='numeric'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={{ marginTop: 32, marginBottom: 16 }}
                />
              )}
              name="value"
            />
            {errors.value && <Text className='text-red-500 text-small ml-2 mb-5'> {errors.value.message} </Text>}

            {/* DATE PICKER */}
            <Controller
              control={control}
              name="dataActivity"
              render={({ field: { value, onChange } }) => (
                <>
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      setShowPicker(true);
                    }}
                    style={{
                      backgroundColor: '#121214',
                      borderWidth: 1,
                      borderColor: '#121214',
                      borderRadius: 6,
                      padding: 14,
                      marginBottom: 16,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontFamily: 'Roboto_400Regular' }}>
                      {value
                        ? value.toLocaleDateString('pt-PT')
                        : 'Selecionar data'}
                    </Text>
                  </Pressable>

                  {showPicker && (
                    <DateTimePicker
                      value={value || new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(_, selectedDate) => {
                        setShowPicker(false);
                        Keyboard.dismiss();
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
            <Button title="Adicionar Atividade" onPress={handleSubmit(onSubmit)} />
          </>
      }

    </Container>
  );
}

export default createActivity;
