import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import ListEmpity from '@/components/ListEmpity';
import Loading from '@/components/Loanding';
import StatusBadge from '@/components/StatusBadge';
import DeclaracaoService from '@/services/api/declaracaoService';
import { SolicitacaoDocumento, TIPOS_DOCUMENTO } from '@/types/solicitacaoDocumento';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const declaracaoService = new DeclaracaoService();

function labelTipoDocumento(tipo: string) {
  return TIPOS_DOCUMENTO.find((t) => t.value === tipo)?.label ?? tipo;
}

function badgeDaSolicitacao(solicitacao: SolicitacaoDocumento) {
  if (solicitacao.estado === 'PENDENTE') return { label: 'Pendente', tone: 'pending' as const };
  if (solicitacao.estado === 'EMITIDA') return { label: 'Emitida', tone: 'success' as const };
  return { label: 'Rejeitada', tone: 'danger' as const };
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-PT');
}

const DeclaracoesScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoDocumento[]>([]);

  const carregar = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await declaracaoService.listarMinhasSolicitacoes();
      setSolicitacoes(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  return (
    <Container>
      <Header />
      <Highliht title="Declarações" subTitle="Peça e acompanhe as suas declarações" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={solicitacoes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={solicitacoes.length === 0 ? { flex: 1 } : { gap: 8, paddingTop: 8 }}
          ListEmptyComponent={() => <ListEmpity message="Ainda não fez nenhuma solicitação" />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const badge = badgeDaSolicitacao(item);
            return (
              <View className="bg-[#29292E] rounded-md p-4 flex-row justify-between items-center">
                <View className="flex-1 pr-2">
                  <Text className="text-gray-100 font-bold mb-1">{labelTipoDocumento(item.tipo_documento)}</Text>
                  <Text className="text-gray-400">{formatarData(item.created_at)}</Text>
                  {item.estado === 'REJEITADA' && item.motivo_rejeicao && (
                    <Text className="text-red-400 mt-1">Motivo: {item.motivo_rejeicao}</Text>
                  )}
                </View>
                <StatusBadge label={badge.label} tone={badge.tone} />
              </View>
            );
          }}
        />
      )}

      <Button title="Nova solicitação" onPress={() => router.push('/(tabs)/declaracoes/nova')} />
    </Container>
  );
};

export default DeclaracoesScreen;
