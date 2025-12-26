
import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Input from '@/components/Input';
import { UsersThreeIcon } from 'phosphor-react-native';
import React from 'react';

const data = [
  { id: '1', title: 'Atividade 1' },
  { id: '2', title: 'Atividade 2' },
  { id: '3', title: 'Atividade 3' },
]

const createActivity = () => {
  return (
    <Container>
      <Header  showBackButton/>
      <UsersThreeIcon color="#00875F" size={56} style={{ alignSelf: "center" }} />
      <Highliht
        title="Nova Actividades"
        subTitle="Cria uma actividade para controlar seus gastos"
      />

      <Input
        style={{ marginTop: 32, marginBottom: 16 }}
        placeholder='Nome da Actividade'
      />

      <Input
        style={{ marginTop: 32, marginBottom: 16 }}
        placeholder='Valor da Actividade'
      />

      <Button title="Adicionar Atividade" />

    </Container>
  );
}

export default createActivity;
