
import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Input from '@/components/Input';
import { useRoute } from '@react-navigation/native';
import { FileTextIcon } from 'phosphor-react-native';
import React from 'react';

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

 React.useEffect(() => {
    const partes = value.split("_");
    const tituloExtraido = partes.shift();  
    const subtituloExtraido = partes.join("_");

    setTitulo(tituloExtraido || '');
    setSubtitulo(subtituloExtraido || '');
  }, [value]);

  


  return (
    <Container>
      <Header showBackButton />
      <FileTextIcon color="#00875F" size={56} style={{ alignSelf: "center" }} />
      <Highliht
        title={`Nova ${titulo}` || "Nova Actividade"}
        subTitle={ `Adicionara ${titulo} em ${subtitulo}` || "Cria uma actividade para controlar seus gastos"}
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
