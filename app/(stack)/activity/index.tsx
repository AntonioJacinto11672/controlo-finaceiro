import Button from '@/components/Button';
import Container from '@/components/Container';
import DetalheButtonAdd from '@/components/DetalheButtonAdd';
import Filter from '@/components/Filter';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import IcomeExpenseCard from '@/components/IcomeExpenseCard';
import ListEmpity from '@/components/ListEmpity';
import Loading from '@/components/Loanding';
import ActivityService from '@/storage/activity.service';
import EspecificActivityService from '@/storage/especificactivity.service';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { ArrowRightIcon, EyeIcon, FileTextIcon } from 'phosphor-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Modal, PanResponder, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [activitiesCal, setActivitiesCal] = useState<EspecificActivityTypeDTO[]>([])
  const [receitasValue, setReceitasValue] = useState<number>(0)
  const [despesasValue, setDespesasValue] = useState<number>(0)
  const [diferRecDesValue, setdiferRecDesValue] = useState<number>(0)
  const [activity, setActivity] = useState<ActivityTypeDTO>()
  const { nameActivity } = route.params as RouteParams;
  const [modalVisible, setModalVisible] = useState(false)
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);


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
    try {
      setIsLoading(true)
      // Implement fetching current activity logic here
      const activityService = new ActivityService();
      const activity = await activityService.getActivityById(nameActivity);
      setActivity(activity);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchActivities() {
    try {

      setIsLoading(true);
      // Implement fetching activities logic here
      const activityService = new EspecificActivityService();
      const activitiesRes = await activityService.getEspecificActivityById(nameActivity);
      //console.log("Atividade comes", activitiesRes);
      setActivitiesCal(activitiesRes || []);

      const totalReceitas = activitiesRes
        .filter(item => item.type === 'receitas')
        .reduce((sum, item) => sum + item.value, 0);
      setReceitasValue(totalReceitas)
      const totalDespesas = activitiesRes
        .filter(item => item.type === 'despesas')
        .reduce((sum, item) => sum + item.value, 0);
      setDespesasValue(totalDespesas)

      /* console.log("dados ", activitiesRes)
      console.log("Receitas e despesas ", receitasValue, despesasValue); */

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function fetchActivityType() {
    try {
      setIsLoading(true);
      // Implement fetching activities logic here
      const activityService = new EspecificActivityService();
      const activities = await activityService.getActivityByType(nameActivity, team.toLowerCase() as 'receitas' | 'despesas');
      //console.log("Atividade comes", activities);
      setActivities(activities || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  //Remover actividade especifica
  const handleRemoveEspecificActivity = async (id: string) => {
    // Implement remove activity logic here
    try {
      setIsLoading(true)
      console.log("Removendo atividade com id:", id);
      const especificActivityService = new EspecificActivityService();
      await especificActivityService.removeEspecificActivity(nameActivity, id);

      Alert.alert("Actividade", "Atividade removida com sucesso!");
      await fetchActivities();
      await fetchActivityType()
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveActivity = async () => {
    // Implement remove activity logic here
    try {
      setIsLoading(true)
      const activityService = new ActivityService();
      await activityService.removeActivity(nameActivity);
      Alert.alert("Actividade", "Atividade removida com sucesso!");
      router.push('/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGroupRemove() {
    try {
      Alert.alert("Remover Actividade", `Deseja remover a Actividade ${activity?.name}?`, [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: async () => {
            // Call the function to remove the group
            await handleRemoveActivity();
            // Navigate back or perform any other action after removal
          }
        }
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Remover Turma", "Não foi possivél remover a turma")
    }
  }

  async function handleActivityRemove(id: string) {
    try {
      Alert.alert("Remover Actividade", `Deseja remover esses pagamento?`, [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: async () => {
            // Call the function to remove the group
            await handleRemoveEspecificActivity(id);
            // Navigate back or perform any other action after removal
          }
        }
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Remover Turma", "Não foi possivél remover a turma")
    }
  }

  useEffect(() => {
    //carregar atividades
    
    fetchCurrentActivity()
    fetchActivityType()
  }, [])

  useEffect(() => {
    if (modalVisible) {
      translateY.setValue(500);
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [modalVisible]);

  useFocusEffect(React.useCallback(() => {
    fetchActivities()
    fetchCurrentActivity();
    fetchActivityType();
  }, [team, nameActivity]))

  useEffect(() => {
    fetchActivityType()
  }, [team])
  return (
    <Container>


      {
        isLoading ?
          <Loading /> :
          <>
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
              <Text className='font-Roboto_700Bold text-white' >AKZ {eyeOpen ? activity?.value : '***'},00</Text>
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
              <Text style={{ fontFamily: 'Roboto_700Bold', fontSize: 14, color: "#C4C4CC" }} > {activities.length} </Text>
            </View>
            <FlatList
              data={activities}
              keyExtractor={item => item.name}
              renderItem={({ item }) => <IcomeExpenseCard name={item.name} value={item.value} type={item.type} onRemove={() => handleActivityRemove(item.id)}
              />}
              ListEmptyComponent={() => <ListEmpity message="Não há receitas nem despesas nessa actividade" />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                { paddingBottom: 100 },
                activities.length === 0 && { flex: 1 }
              ]}
            />
            <Button title="Remover Actividade" type="SECONDARY" onPress={() => { handleGroupRemove() }} />

          </>
      }
      {/* Modal */}
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
                <Pressable onPress={() => { setModalVisible(false); router.push({ pathname: '/(stack)/activity/details', params: { id: nameActivity } }) }} className='text-sm mr-3'>
                  <Text className='text-sm text-blue-500 mr-3'>Ver mais</Text>
                </Pressable>
                <ArrowRightIcon size={32} color="#00B37E" />
              </View>

              <DetalheButtonAdd eyeOpen={eyeOpen} title="Receitas" value={receitasValue ? receitasValue : 0} onPressAdd={() => { addNewActivity("Receitas") }} />
              <DetalheButtonAdd eyeOpen={eyeOpen} title="Despesas" value={despesasValue ? despesasValue : 0} onPressAdd={() => { addNewActivity("Despesas") }} />

              <Text className='text-white mt-4 font-Roboto_400Regular text-sm pb-1'>Saldo da Actividade</Text>
              <View className='bg-[#121214] h-[50] rounded-md items-center justify-center mt-2'>
                <Text className='text-white font-Roboto_700Bold text-lg'>AKZ {eyeOpen ?  receitasValue - despesasValue : '***'},00</Text>
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
