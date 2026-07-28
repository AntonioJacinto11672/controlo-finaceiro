import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Input from '@/components/Input';
import { faltaService } from '@/services/falta.service';
import { PrevisibilidadeFalta } from '@/services/types';
import { formatDate, toIsoDate } from '@/utils/format';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const PREVISIBILIDADE_LABEL: Record<PrevisibilidadeFalta, string> = {
  [PrevisibilidadeFalta.PREVISIVEL]: 'Previsível',
  [PrevisibilidadeFalta.CONHECIMENTO_SEMANA_ANTERIOR]: 'Soube na semana anterior',
  [PrevisibilidadeFalta.IMPREVISTA]: 'Imprevista',
};

const JustificarFaltaScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [motivo, setMotivo] = useState('');
  const [previsibilidade, setPrevisibilidade] = useState<PrevisibilidadeFalta>(PrevisibilidadeFalta.IMPREVISTA);
  const [dataComunicacao, setDataComunicacao] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [documento, setDocumento] = useState<{ uri: string; name: string; mimeType?: string | null } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const escolherDocumento = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: false, copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setDocumento({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType });
  };

  const onSubmit = async () => {
    if (!motivo.trim()) {
      Alert.alert('Justificação', 'Indica o motivo da falta.');
      return;
    }

    try {
      setIsSubmitting(true);

      let documento_comprovativo: string | undefined;
      if (documento) {
        const uploaded = await faltaService.upload(documento);
        documento_comprovativo = uploaded.url;
      }

      await faltaService.justificar(id, {
        motivo: motivo.trim(),
        previsibilidade,
        data_comunicacao: toIsoDate(dataComunicacao),
        documento_comprovativo,
      });

      Alert.alert('Justificação enviada', 'A tua justificação foi submetida e aguarda aprovação do RH.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível justificar a falta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Header showBackButton />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Highliht title="Justificar falta" subTitle="Explica o motivo da tua ausência" />

        <Input placeholder="Motivo da falta" value={motivo} onChangeText={setMotivo} multiline />

        <Text className="text-gray-300 mb-2">Previsibilidade</Text>
        <View className="flex-row flex-wrap mb-4">
          {Object.values(PrevisibilidadeFalta).map((valor) => (
            <TouchableOpacity
              key={valor}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                previsibilidade === valor ? 'bg-[#00875F]' : 'bg-[#121214]'
              }`}
              onPress={() => setPrevisibilidade(valor)}
            >
              <Text className="text-white text-sm">{PREVISIBILIDADE_LABEL[valor]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-300 mb-2">Data em que comunicaste a ausência</Text>
        <TouchableOpacity className="p-4 bg-[#121214] rounded-2xl mb-4" onPress={() => setShowPicker(true)}>
          <Text className="text-white">{formatDate(toIsoDate(dataComunicacao))}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={dataComunicacao}
            mode="date"
            maximumDate={new Date()}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(_, date) => {
              setShowPicker(Platform.OS === 'ios');
              if (date) setDataComunicacao(date);
            }}
          />
        )}

        <Text className="text-gray-300 mb-2">Documento comprovativo (opcional)</Text>
        <TouchableOpacity
          className="p-4 bg-[#121214] rounded-2xl mb-4 border border-dashed border-[#7C7C8A]"
          onPress={escolherDocumento}
        >
          <Text className="text-gray-300 text-center">
            {documento ? documento.name : 'Toca para anexar um documento'}
          </Text>
        </TouchableOpacity>

        <Button title={isSubmitting ? 'A enviar...' : 'Submeter justificação'} onPress={onSubmit} />
        {isSubmitting && <ActivityIndicator className="mt-3" color="#00875F" />}
        <View className="h-8" />
      </ScrollView>
    </Container>
  );
};

export default JustificarFaltaScreen;
