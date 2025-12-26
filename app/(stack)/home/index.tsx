
import ActivityCard from '@/components/ActivityCard';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import ListEmpity from '@/components/ListEmpity';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList } from 'react-native';


const data = [
  { id: '1', title: 'Atividade 1' },
  { id: '2', title: 'Atividade 2' },
  { id: '3', title: 'Atividade 3' },
]

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activity, setActivity] = useState<string[]>([]);
  const router = useRouter();
  const navigation = useNavigation()
  
  async function handleOpenActivity(nameActivity: string) {
    router.push({
      pathname: '/(stack)/activity',
      params: { nameActivity }
    });
  }
  return (
    <Container>
      <Header />
      <Highliht
        title="Actividades"
        subTitle="Controle as suas actividades"
      />

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={data.length === 0 && { flex: 1 }}
        renderItem={({ item }) => <ActivityCard key={item.id} Title={item.title} onPress={() => handleOpenActivity(item.title)} />}
        ListEmptyComponent={() => <ListEmpity message="Nenhuma atividade encontrada" />}
        showsVerticalScrollIndicator={false}
      />
      <Button title="Adicionar Atividade" onPress={() => router.push("/(stack)/newActivity")} />
    </Container>
  );
}

export default HomeScreen;
