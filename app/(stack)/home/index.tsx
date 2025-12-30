
import ActivityCard from '@/components/ActivityCard';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import ListEmpity from '@/components/ListEmpity';
import Loading from '@/components/Loanding';
import ActivityService from '@/storage/activity.service';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList } from 'react-native';


const data = [
  { id: '1', title: 'Atividade 1' },
  { id: '2', title: 'Atividade 2' },
  { id: '3', title: 'Atividade 3' },
]

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityTypeDTO[]>([]);
  const router = useRouter();
  const navigation = useNavigation()

  async function handleOpenActivity(nameActivity: string) {
    router.push({
      pathname: '/(stack)/activity',
      params: { nameActivity }
    });
  }

  async function addNewActivity(value: string) {
    router.push({
      pathname: '/(stack)/newActivity',
      params: { value }
    })
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const actvityModel = new ActivityService();
      const data = await actvityModel.getAllActivities();
      setActivity(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Turmas", "Não foi possível carregar as turmas")
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    fetchGroups();
  }, []);

  useFocusEffect(React.useCallback(() => {
    fetchGroups()
  }, []))
  return (
    <Container>


      {
        isLoading ?

          <Loading /> :
          <>
            <Header />
            <Highliht
              title="Actividades"
              subTitle="Controle as suas actividades"
            />
            <FlatList
              data={activity}
              keyExtractor={item => item.id}
              contentContainerStyle={activity.length === 0 && { flex: 1 }}
              renderItem={({ item }) => <ActivityCard key={item.id} Title={item.name} onPress={() => handleOpenActivity(item.id)} />}
              ListEmptyComponent={() => <ListEmpity message="Nenhuma atividade encontrada" />}
              showsVerticalScrollIndicator={false}
            />
            <Button title="Adicionar Atividade" onPress={() => addNewActivity('Actividade')} />
          </>
      }
    </Container>
  );
}

export default HomeScreen;
