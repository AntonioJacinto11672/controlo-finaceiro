import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Input from '@/components/Input';
import { solicitacaoDocumentoService } from '@/services/solicitacaoDocumento.service';
import { TipoDocumento } from '@/services/types';
import { TIPO_DOCUMENTO_LABEL } from '@/utils/format';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const TIPOS: TipoDocumento[] = [
  'declaracao_ocupacao',
  'declaracao_salario',
  'declaracao_tempo_servico',
  'certidao_servico_publico',
  'declaracao_disponibilidade',
  'outra',
];

const NovaDeclaracaoScreen = () => {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoDocumento>('declaracao_ocupacao');
  const [observacoes, setObservacoes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      await solicitacaoDocumentoService.criar({ tipo_documento: tipo, observacoes: observacoes || undefined });
      Alert.alert('Pedido enviado', 'O teu pedido de declaração foi submetido e aguarda emissão pelo RH.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível submeter o pedido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Header showBackButton />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Highliht title="Nova declaração" subTitle="Pede uma declaração ou certidão ao RH" />

        <Text className="text-gray-300 mb-2">Tipo de documento</Text>
        <View className="flex-row flex-wrap mb-4">
          {TIPOS.map((valor) => (
            <TouchableOpacity
              key={valor}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${tipo === valor ? 'bg-[#00875F]' : 'bg-[#121214]'}`}
              onPress={() => setTipo(valor)}
            >
              <Text className="text-white text-sm">{TIPO_DOCUMENTO_LABEL[valor]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          placeholder="Observações (opcional)"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
        />

        <Button title={isSubmitting ? 'A enviar...' : 'Submeter pedido'} onPress={onSubmit} />
        {isSubmitting && <ActivityIndicator className="mt-3" color="#00875F" />}
        <View className="h-8" />
      </ScrollView>
    </Container>
  );
};

export default NovaDeclaracaoScreen;
