import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Input from '@/components/Input';
import PickerField from '@/components/PickerField';
import DeclaracaoService from '@/services/api/declaracaoService';
import { TIPOS_DOCUMENTO, TipoDocumento } from '@/types/solicitacaoDocumento';
import { AppError } from '@/utils/AppError';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';

const declaracaoService = new DeclaracaoService();

const NovaDeclaracaoScreen = () => {
  const router = useRouter();
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>();
  const [observacoes, setObservacoes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async () => {
    if (!tipoDocumento) {
      Alert.alert('Erro', 'Selecione o tipo de documento.');
      return;
    }

    try {
      setIsSaving(true);
      await declaracaoService.criarSolicitacao({ tipo_documento: tipoDocumento, observacoes: observacoes.trim() || undefined });
      Alert.alert('Sucesso', 'Solicitação enviada ao RH.');
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error instanceof AppError ? error.message : 'Não foi possível enviar a solicitação.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <Header showBackButton />
      <Highliht title="Nova solicitação" subTitle="Peça uma declaração ao RH" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <PickerField
          label="Tipo de documento"
          options={TIPOS_DOCUMENTO}
          value={tipoDocumento}
          onChange={setTipoDocumento}
        />

        <Text className="text-gray-100 ml-1 mb-2">Observações (opcional)</Text>
        <Input
          placeholder="Ex.: preciso para efeitos bancários"
          multiline
          numberOfLines={3}
          value={observacoes}
          onChangeText={setObservacoes}
        />

        <Button title={isSaving ? 'A enviar...' : 'Enviar solicitação'} onPress={onSubmit} />
      </ScrollView>
    </Container>
  );
};

export default NovaDeclaracaoScreen;
