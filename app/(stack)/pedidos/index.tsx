import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import ListEmpity from '@/components/ListEmpity';
import Loading from '@/components/Loanding';
import StatusBadge from '@/components/StatusBadge';
import { faltaService } from '@/services/falta.service';
import { licencaService } from '@/services/licenca.service';
import { solicitacaoDocumentoService } from '@/services/solicitacaoDocumento.service';
import { Falta, Licenca, SolicitacaoDocumento } from '@/services/types';
import {
  ESTADO_FALTA_COLOR,
  ESTADO_FALTA_LABEL,
  ESTADO_LICENCA_COLOR,
  ESTADO_LICENCA_LABEL,
  ESTADO_SOLICITACAO_COLOR,
  ESTADO_SOLICITACAO_LABEL,
  TIPO_DOCUMENTO_LABEL,
  formatDate,
} from '@/utils/format';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';

type Segmento = 'licencas' | 'faltas' | 'declaracoes';

const PedidosScreen = () => {
  const router = useRouter();
  const [segmento, setSegmento] = useState<Segmento>('licencas');
  const [isLoading, setIsLoading] = useState(true);
  const [licencas, setLicencas] = useState<Licenca[]>([]);
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [declaracoes, setDeclaracoes] = useState<SolicitacaoDocumento[]>([]);

  const carregar = useCallback(async () => {
    try {
      setIsLoading(true);
      const [licencasData, faltasData, declaracoesData] = await Promise.all([
        licencaService.minhas(),
        faltaService.minhas(),
        solicitacaoDocumentoService.minhas(),
      ]);
      setLicencas(licencasData);
      setFaltas(faltasData);
      setDeclaracoes(declaracoesData);
    } catch (error: any) {
      Alert.alert('Pedidos', error?.message || 'Não foi possível carregar os pedidos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const SEGMENTOS: { key: Segmento; label: string }[] = [
    { key: 'licencas', label: 'Férias/Licenças' },
    { key: 'faltas', label: 'Faltas' },
    { key: 'declaracoes', label: 'Declarações' },
  ];

  return (
    <Container>
      <Header />
      <Highliht title="Pedidos" subTitle="Férias, licenças, faltas e declarações" />

      <View className="flex-row mb-4 bg-[#121214] rounded-xl p-1">
        {SEGMENTOS.map((s) => (
          <TouchableOpacity
            key={s.key}
            className={`flex-1 py-2 rounded-lg ${segmento === s.key ? 'bg-[#00875F]' : ''}`}
            onPress={() => setSegmento(s.key)}
          >
            <Text className="text-center text-white font-semibold text-xs">{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <Loading />
      ) : segmento === 'licencas' ? (
        <FlatList
          data={licencas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={licencas.length === 0 && { flex: 1 }}
          showsVerticalScrollIndicator={false}
          onRefresh={carregar}
          refreshing={false}
          ListEmptyComponent={() => <ListEmpity message="Ainda não tens pedidos de férias/licença" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-[#121214] rounded-xl p-4 mb-3"
              onPress={() => router.push({ pathname: '/(stack)/pedidos/[id]', params: { id: item.id } })}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-white font-semibold flex-1 mr-2">
                  {item.tipoLicenca?.nome ?? 'Licença'}
                </Text>
                <StatusBadge label={ESTADO_LICENCA_LABEL[item.estado]} color={ESTADO_LICENCA_COLOR[item.estado]} />
              </View>
              <Text className="text-gray-400 text-sm">
                {formatDate(item.data_inicio)} — {formatDate(item.data_fim_prevista)}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : segmento === 'faltas' ? (
        <FlatList
          data={faltas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={faltas.length === 0 && { flex: 1 }}
          showsVerticalScrollIndicator={false}
          onRefresh={carregar}
          refreshing={false}
          ListEmptyComponent={() => <ListEmpity message="Sem faltas registadas" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-[#121214] rounded-xl p-4 mb-3"
              onPress={() => {
                if (!item.motivo) {
                  router.push({
                    pathname: '/(stack)/assiduidade/justificar/[id]',
                    params: { id: item.id },
                  });
                }
              }}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-white font-semibold flex-1 mr-2">{formatDate(item.data)}</Text>
                <StatusBadge
                  label={ESTADO_FALTA_LABEL[item.estado_aprovacao]}
                  color={ESTADO_FALTA_COLOR[item.estado_aprovacao]}
                />
              </View>
              <Text className="text-gray-400 text-sm">
                {item.motivo ? item.motivo : 'Ainda por justificar — toca para justificar'}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={declaracoes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={declaracoes.length === 0 && { flex: 1 }}
          showsVerticalScrollIndicator={false}
          onRefresh={carregar}
          refreshing={false}
          ListEmptyComponent={() => <ListEmpity message="Ainda não pediste nenhuma declaração" />}
          renderItem={({ item }) => (
            <View className="bg-[#121214] rounded-xl p-4 mb-3">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-white font-semibold flex-1 mr-2">
                  {TIPO_DOCUMENTO_LABEL[item.tipo_documento] ?? item.tipo_documento}
                </Text>
                <StatusBadge
                  label={ESTADO_SOLICITACAO_LABEL[item.estado]}
                  color={ESTADO_SOLICITACAO_COLOR[item.estado]}
                />
              </View>
              <Text className="text-gray-400 text-sm">{formatDate(item.created_at)}</Text>
              {item.estado === 'REJEITADA' && item.motivo_rejeicao && (
                <Text className="text-[#F75A68] text-sm mt-1">Motivo: {item.motivo_rejeicao}</Text>
              )}
            </View>
          )}
        />
      )}

      <View className="mt-3">
        {segmento === 'licencas' && (
          <Button title="Novo pedido" onPress={() => router.push('/(stack)/pedidos/novo')} />
        )}
        {segmento === 'declaracoes' && (
          <Button title="Nova declaração" onPress={() => router.push('/(stack)/pedidos/nova-declaracao')} />
        )}
      </View>
    </Container>
  );
};

export default PedidosScreen;
