import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Input from '@/components/Input';
import Loading from '@/components/Loanding';
import { licencaService } from '@/services/licenca.service';
import { tipoLicencaService } from '@/services/tipoLicenca.service';
import { TipoLicenca } from '@/services/types';
import { formatDate, toIsoDate } from '@/utils/format';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const MS_POR_DIA = 24 * 60 * 60 * 1000;

const NovoPedidoScreen = () => {
  const router = useRouter();
  const [isLoadingTipos, setIsLoadingTipos] = useState(true);
  const [tipos, setTipos] = useState<TipoLicenca[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoLicenca | null>(null);

  const [dataInicio, setDataInicio] = useState<Date>(new Date());
  const [dataFim, setDataFim] = useState<Date>(new Date());
  const [showPickerInicio, setShowPickerInicio] = useState(false);
  const [showPickerFim, setShowPickerFim] = useState(false);

  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [documento, setDocumento] = useState<{ uri: string; name: string; mimeType?: string | null } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await tipoLicencaService.listar();
        setTipos(data);
        setTipoSelecionado(data[0] ?? null);
      } catch (error: any) {
        Alert.alert('Tipos de licença', error?.message || 'Não foi possível carregar os tipos de licença.');
      } finally {
        setIsLoadingTipos(false);
      }
    })();
  }, []);

  const diasConcedidos = Math.max(
    1,
    Math.round((dataFim.setHours(0, 0, 0, 0) - dataInicio.setHours(0, 0, 0, 0)) / MS_POR_DIA) + 1,
  );

  const escolherDocumento = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: false, copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setDocumento({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType });
  };

  const onSubmit = async () => {
    if (!tipoSelecionado) {
      Alert.alert('Pedido', 'Seleciona o tipo de férias/licença.');
      return;
    }
    if (tipoSelecionado.exige_documento && !documento) {
      Alert.alert('Pedido', `O tipo "${tipoSelecionado.nome}" exige documento comprovativo.`);
      return;
    }

    try {
      setIsSubmitting(true);

      let documento_comprovativo: string | undefined;
      if (documento) {
        setIsUploading(true);
        const uploaded = await licencaService.upload(documento);
        documento_comprovativo = uploaded.url;
        setIsUploading(false);
      }

      await licencaService.criar({
        id_tipo_licenca: tipoSelecionado.id,
        data_inicio: toIsoDate(dataInicio),
        data_fim_prevista: toIsoDate(dataFim),
        dias_concedidos: diasConcedidos,
        motivo: motivo || undefined,
        observacoes: observacoes || undefined,
        documento_comprovativo,
      });

      Alert.alert('Pedido enviado', 'O teu pedido foi submetido e aguarda aprovação do RH.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Não foi possível submeter o pedido.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (isLoadingTipos) {
    return (
      <Container>
        <Header showBackButton />
        <Loading />
      </Container>
    );
  }

  return (
    <Container>
      <Header showBackButton />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Highliht title="Novo pedido" subTitle="Férias, licença ou outra ausência" />

        <Text className="text-gray-300 mb-2">Tipo</Text>
        <View className="flex-row flex-wrap mb-4">
          {tipos.map((tipo) => (
            <TouchableOpacity
              key={tipo.id}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                tipoSelecionado?.id === tipo.id ? 'bg-[#00875F]' : 'bg-[#121214]'
              }`}
              onPress={() => setTipoSelecionado(tipo)}
            >
              <Text className="text-white text-sm">{tipo.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-gray-300 mb-2">Data de início</Text>
        <TouchableOpacity
          className="p-4 bg-[#121214] rounded-2xl mb-3"
          onPress={() => setShowPickerInicio(true)}
        >
          <Text className="text-white">{formatDate(toIsoDate(dataInicio))}</Text>
        </TouchableOpacity>
        {showPickerInicio && (
          <DateTimePicker
            value={dataInicio}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(_, date) => {
              setShowPickerInicio(Platform.OS === 'ios');
              if (date) setDataInicio(date);
            }}
          />
        )}

        <Text className="text-gray-300 mb-2">Data de fim prevista</Text>
        <TouchableOpacity className="p-4 bg-[#121214] rounded-2xl mb-3" onPress={() => setShowPickerFim(true)}>
          <Text className="text-white">{formatDate(toIsoDate(dataFim))}</Text>
        </TouchableOpacity>
        {showPickerFim && (
          <DateTimePicker
            value={dataFim}
            mode="date"
            minimumDate={dataInicio}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(_, date) => {
              setShowPickerFim(Platform.OS === 'ios');
              if (date) setDataFim(date);
            }}
          />
        )}

        <Text className="text-gray-400 mb-4">Dias concedidos: {diasConcedidos}</Text>

        <Input placeholder="Motivo (opcional)" value={motivo} onChangeText={setMotivo} multiline />
        <Input
          placeholder="Observações (opcional)"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
        />

        <Text className="text-gray-300 mb-2 mt-1">
          Documento comprovativo {tipoSelecionado?.exige_documento ? '(obrigatório)' : '(opcional)'}
        </Text>
        <TouchableOpacity
          className="p-4 bg-[#121214] rounded-2xl mb-4 border border-dashed border-[#7C7C8A]"
          onPress={escolherDocumento}
        >
          <Text className="text-gray-300 text-center">
            {documento ? documento.name : 'Toca para anexar um documento'}
          </Text>
        </TouchableOpacity>

        <Button
          title={isUploading ? 'A anexar documento...' : isSubmitting ? 'A enviar...' : 'Submeter pedido'}
          onPress={onSubmit}
        />
        {(isSubmitting || isUploading) && <ActivityIndicator className="mt-3" color="#00875F" />}
        <View className="h-8" />
      </ScrollView>
    </Container>
  );
};

export default NovoPedidoScreen;
