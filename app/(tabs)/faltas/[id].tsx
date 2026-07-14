import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Input from '@/components/Input';
import Loading from '@/components/Loanding';
import PickerField from '@/components/PickerField';
import StatusBadge from '@/components/StatusBadge';
import FaltaService from '@/services/api/faltaService';
import { Falta, PrevisibilidadeFalta } from '@/types/falta';
import { AppError } from '@/utils/AppError';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

const faltaService = new FaltaService();

const PREVISIBILIDADE_OPCOES: { value: PrevisibilidadeFalta; label: string }[] = [
  { value: 'PREVISIVEL', label: 'Previsível' },
  { value: 'CONHECIMENTO_SEMANA_ANTERIOR', label: 'Soube na semana anterior' },
  { value: 'IMPREVISTA', label: 'Imprevista' },
];

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-PT');
}

function badgeDaFalta(falta: Falta) {
  if (falta.estado_aprovacao === 'PENDENTE') return { label: 'Pendente', tone: 'pending' as const };
  if (falta.estado_aprovacao === 'APROVADA') return { label: 'Justificada', tone: 'success' as const };
  return { label: 'Rejeitada', tone: 'danger' as const };
}

const FaltaDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [falta, setFalta] = useState<Falta | null>(null);

  const [motivo, setMotivo] = useState('');
  const [previsibilidade, setPrevisibilidade] = useState<PrevisibilidadeFalta>();
  const [dataComunicacao, setDataComunicacao] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [anexo, setAnexo] = useState<{ uri: string; name: string; type: string } | null>(null);

  const carregar = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await faltaService.obterFalta(id);
      setFalta(data);
    } catch (error: any) {
      Alert.alert('Erro', error instanceof AppError ? error.message : 'Não foi possível carregar a falta.');
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const escolherAnexo = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso às fotos para anexar o documento.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!resultado.canceled) {
      const asset = resultado.assets[0];
      setAnexo({ uri: asset.uri, name: asset.fileName ?? 'documento.jpg', type: asset.mimeType ?? 'image/jpeg' });
    }
  };

  const onSubmit = async () => {
    if (!motivo.trim()) {
      Alert.alert('Erro', 'Indique o motivo da falta.');
      return;
    }
    if (!previsibilidade) {
      Alert.alert('Erro', 'Indique a previsibilidade da falta.');
      return;
    }

    try {
      setIsSaving(true);
      let documento_comprovativo: string | undefined;
      if (anexo) {
        const uploaded = await faltaService.uploadDocumento(anexo);
        documento_comprovativo = uploaded.url;
      }

      await faltaService.justificarFalta(id, {
        motivo: motivo.trim(),
        previsibilidade,
        data_comunicacao: dataComunicacao.toISOString().slice(0, 10),
        documento_comprovativo,
      });

      Alert.alert('Sucesso', 'Justificação submetida. Aguarde a decisão do RH.');
      await carregar();
    } catch (error: any) {
      Alert.alert('Erro', error instanceof AppError ? error.message : 'Não foi possível submeter a justificação.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !falta) return <Loading />;

  const podeJustificar = falta.estado_aprovacao === 'PENDENTE' && !falta.motivo;
  const badge = badgeDaFalta(falta);

  return (
    <Container>
      <Header showBackButton />
      <Highliht title={formatarData(falta.data)} subTitle="Detalhe da falta" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center bg-[#29292E] rounded-md p-4 mb-4">
          <Text className="text-gray-100 font-bold">{falta.tipo === 'JUSTIFICADA' ? 'Justificada' : 'Injustificada'}</Text>
          <StatusBadge label={badge.label} tone={badge.tone} />
        </View>

        {podeJustificar ? (
          <>
            <Text className="text-gray-300 text-sm mb-4">
              Regras de prazo: se a falta era previsível, o aviso deve ser dado com pelo menos 5 dias úteis de
              antecedência; se soube na semana anterior, deve comunicar de imediato; se foi imprevista, deve
              comunicar logo que possível.
            </Text>

            <Text className="text-gray-100 ml-1 mb-2">Motivo</Text>
            <Input
              placeholder="Descreva o motivo da falta"
              multiline
              numberOfLines={3}
              value={motivo}
              onChangeText={setMotivo}
            />

            <PickerField
              label="Previsibilidade"
              options={PREVISIBILIDADE_OPCOES}
              value={previsibilidade}
              onChange={setPrevisibilidade}
            />

            <Text className="text-gray-100 ml-1 mb-2">Data de comunicação</Text>
            <Pressable
              className="p-4 bg-[#121214] rounded-2xl mb-4"
              onPress={() => setMostrarDatePicker(true)}
            >
              <Text className="text-gray-100">{formatarData(dataComunicacao.toISOString())}</Text>
            </Pressable>
            {mostrarDatePicker && (
              <DateTimePicker
                value={dataComunicacao}
                mode="date"
                display="default"
                onChange={(_event, selectedDate) => {
                  setMostrarDatePicker(false);
                  if (selectedDate) setDataComunicacao(selectedDate);
                }}
              />
            )}

            <Pressable className="p-4 bg-[#121214] rounded-2xl mb-6" onPress={escolherAnexo}>
              <Text className="text-gray-100">
                {anexo ? 'Documento anexado ✓' : 'Anexar documento comprovativo (opcional)'}
              </Text>
            </Pressable>

            <Button title={isSaving ? 'A submeter...' : 'Submeter justificação'} onPress={onSubmit} />
          </>
        ) : (
          <View className="bg-[#29292E] rounded-md p-4">
            <Text className="text-gray-400 mb-1">Motivo</Text>
            <Text className="text-gray-100 mb-3">{falta.motivo ?? 'Ainda não justificada'}</Text>
            {falta.observacoes && (
              <>
                <Text className="text-gray-400 mb-1">Observações do RH</Text>
                <Text className="text-gray-100">{falta.observacoes}</Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default FaltaDetailScreen;
