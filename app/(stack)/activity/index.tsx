import Button from '@/components/Button';
import ButtonIcon from '@/components/ButtonIcon';
import Container from '@/components/Container';
import Filter from '@/components/Filter';
import Form from '@/components/Form';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import IcomeExpenseCard from '@/components/IcomeExpenseCard';
import Input from '@/components/Input';
import ListEmpity from '@/components/ListEmpity';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

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
  const [team, setTeam] = useState("Time A")
  const [activities, setActivities] = useState<ActivityTypeDTO[]>([])
  const { nameActivity } = route.params as RouteParams;
  useEffect(() => {
    //carregar atividades
    
  }
  , [])
  return (
    <Container>
      <Header showBackButton />
      <Highliht
        title={nameActivity}
        subTitle="Controle as suas actividades"
      />
      <Form>
        <Input
          placeholder="Nome da Pessoa"
          autoCorrect={false}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={() => console.log("Teste Activite")} />
      </Form>

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
        renderItem={({ item }) => <IcomeExpenseCard name={item.name} onRemove={() => { () => { } }}

        />}
        ListEmptyComponent={() => <ListEmpity message="Não há receitas nem despesas nessa actividade" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          codata.length === 0 && { flex: 1 }
        ]}
      />
      <Button title="Remover Turma" type="SECONDARY" onPress={() => {}} />
    </Container>
  );
}

export default Activity;
