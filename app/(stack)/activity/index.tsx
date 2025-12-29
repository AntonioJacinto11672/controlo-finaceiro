import Button from '@/components/Button';
import Container from '@/components/Container';
import DetalheButtonAdd from '@/components/DetalheButtonAdd';
import Filter from '@/components/Filter';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import IcomeExpenseCard from '@/components/IcomeExpenseCard';
import ListEmpity from '@/components/ListEmpity';
import ActivityService from '@/storage/activity.service';
import { useRoute } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import { ArrowRightIcon, EyeIcon, FileTextIcon } from 'phosphor-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Modal, PanResponder, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EyeSlashIcon } from 'react-native-heroicons/solid';

type RouteParams = {
  nameActivity: string
}

const codata = [
  { id: '1', name: 'João Silva', value: 1500, type: 'income' },
  { id: '2', name: 'Maria Souza', value: 500, type: 'expense' },
  { id: '3', name: 'Carlos Pereira', value: 2000, type: 'income' },
]
const Activity = () => {
  const route = useRoute();
  const [team, setTeam] = useState("Receitas")
  const [eyeOpen, setEyeOpen] = useState(false)
  const [activities, setActivities] = useState<EspecificActivityTypeDTO[]>([])
  const [activity, setActivity] = useState<ActivityTypeDTO>()
  const { nameActivity } = route.params as RouteParams;
  const [modalVisible, setModalVisible] = useState(false)
  const router = useRouter();

  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_evt, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_evt, gesture) => {
        if (gesture.dy > 120 || gesture.vy > 0.5) {
          Animated.timing(translateY, { toValue: 1000, duration: 200, useNativeDriver: true }).start(() => {
            translateY.setValue(0);
            setModalVisible(false);
          });
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;


  async function addNewActivity(value: string) {

    const texto = `${value}_${nameActivity}`;
    setModalVisible(false);
    router.push({
      pathname: '/(stack)/newActivity',
      params: { value: texto }
    })
  }

  async function fetchCurrentActivity() {
    // Implement fetching current activity logic here
    const activityService = new ActivityService();
    const activity = await activityService.getActivityById(nameActivity);
    setActivity(activity);
  }

  useEffect(() => {
    //carregar atividades

    fetchCurrentActivity()
  }, [])

  useEffect(() => {
    if (modalVisible) {
      translateY.setValue(500);
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [modalVisible]);

  return (
    <Container>
      <Header showBackButton />
      <Highliht
        title={activity ? activity.name : "Atividade"}
        subTitle="Controle as suas actividades"
      />

      <View className='flex-row items-center justify-center gap-2'>
        <TouchableOpacity onPress={() => setEyeOpen(!eyeOpen)}>
          {
            eyeOpen ? <EyeIcon size={24} color="#00B37E" /> : <EyeSlashIcon size={24} color="#7C7C8A" />
          }
        </TouchableOpacity>
        <Text className='font-Roboto_700Bold text-white' >AKZ {eyeOpen ? 2000 : '***'},00</Text>
      </View>
      <TouchableOpacity className='flex-row gap-1 border border-[#095c4371] mt-2 p-2.5  rounded-md items-center justify-center  self-center '
        onPress={() => setModalVisible(true)}
      >
        <FileTextIcon size={20} color="#095c4371" />
        <Text className='text-white '>Ver Detalhes da Actividade</Text>
      </TouchableOpacity>


      <View className='w-full flex-row items-center mt-8 mx-0 mb-12'>
        <FlatList
          data={["Receitas", "Despesas"]}
          keyExtractor={item => item}
          renderItem={({ item }) => <Filter isActive={item === team} title={item}
            onPress={() => setTeam(item)}
          />}
          horizontal
        />
        <Text style={{ fontFamily: 'Roboto_700Bold', fontSize: 14, color: "#C4C4CC" }} >0</Text>
      </View>
      <FlatList
        data={codata}
        keyExtractor={item => item.name}
        renderItem={({ item }) => <IcomeExpenseCard name={item.name} value={item.value} onRemove={() => { () => { } }}

        />}
        ListEmptyComponent={() => <ListEmpity message="Não há receitas nem despesas nessa actividade" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          codata.length === 0 && { flex: 1 }
        ]}
      />
      <Button title="Remover Turma" type="SECONDARY" onPress={() => { }} />
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => {
          Animated.timing(translateY, { toValue: 1000, duration: 200, useNativeDriver: true }).start(() => setModalVisible(false));
        }}
      >
        <Pressable style={styles.modalOverlay} onPress={() => {
          Animated.timing(translateY, { toValue: 1000, duration: 200, useNativeDriver: true }).start(() => setModalVisible(false));
        }}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
            <Pressable onPress={() => { }} style={{ flex: 1 }}>
              <View className='flex-row items-center mb-6'>
                <Text className='flex-1 text-white font-Roboto_400Regular text-sm pb-1'>Detalhes da Actividade</Text>
                <Link href={"/"} className='text-sm text-blue-500 mr-3'>Ver mais</Link>
                <ArrowRightIcon size={32} color="#00B37E" />
              </View>

              <DetalheButtonAdd eyeOpen={eyeOpen} title="Receitas" value={2000} onPressAdd={() => { addNewActivity("Receitas") }} />
              <DetalheButtonAdd eyeOpen={eyeOpen} title="Despesas" value={1000} onPressAdd={() => { addNewActivity("Despesas") }} />

              <Text className='text-white mt-4 font-Roboto_400Regular text-sm pb-1'>Saldo da Actividade</Text>
              <View className='bg-[#121214] h-[50] rounded-md items-center justify-center mt-2'>
                <Text className='text-white font-Roboto_700Bold text-lg'>AKZ {eyeOpen ? 1000 : '***'},00</Text>
              </View>


            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    height: '37%',
    width: '100%',
    backgroundColor: '#202024',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
});

export default Activity;
