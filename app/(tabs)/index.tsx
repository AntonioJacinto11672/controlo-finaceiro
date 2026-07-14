import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Loading from '@/components/Loanding';
import { useAuth } from '@/contexts/AuthContext';
import DeclaracaoService from '@/services/api/declaracaoService';
import FaltaService from '@/services/api/faltaService';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const faltaService = new FaltaService();
const declaracaoService = new DeclaracaoService();

const ESTADO_LABEL: Record<string, string> = {
  ATIVO: 'Ativo',
  EM_LICENCA: 'Em licença',
  SUSPENSO: 'Suspenso',
  INATIVO: 'Inativo',
};

const HomeScreen = () => {
  const { funcionario } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [faltasPendentes, setFaltasPendentes] = useState(0);
  const [ultimaSolicitacaoEstado, setUltimaSolicitacaoEstado] = useState<string | null>(null);

  const carregarResumo = useCallback(async () => {
    try {
      setIsLoading(true);
      const [faltas, solicitacoes] = await Promise.all([
        faltaService.listarMinhasFaltas(),
        declaracaoService.listarMinhasSolicitacoes(),
      ]);
      setFaltasPendentes(faltas.filter((f) => f.estado_aprovacao === 'PENDENTE' && !f.motivo).length);
      setUltimaSolicitacaoEstado(solicitacoes[0]?.estado ?? null);
    } catch (error) {
      // silencioso — o dashboard não deve bloquear com alertas
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarResumo();
    }, [carregarResumo]),
  );

  if (isLoading) return <Loading />;

  return (
    <Container>
      <Header />
      <Highliht title={`Olá, ${funcionario?.nome_completo?.split(' ')[0] ?? ''}`} subTitle="Bem-vindo(a) ao TCL RH" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-[#f7931e] rounded-md p-4 mb-4">
          <Text className="text-[#5f0221] mb-1">Nº de agente</Text>
          <Text className="text-gray-100 font-bold mb-3">{funcionario?.numero_agente}</Text>
          <Text className="text-[#] mb-1">Estado</Text>
          <Text className="text-gray-100 font-bold">
            {ESTADO_LABEL[funcionario?.estado ?? ''] ?? funcionario?.estado}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-[#29292E] rounded-md p-4 mb-4"
          onPress={() => router.push('/(tabs)/faltas')}
        >
          <Text className="text-gray-400 mb-1">Faltas por justificar</Text>
          <Text className="text-2xl font-bold text-[#F5A623]">{faltasPendentes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#29292E] rounded-md p-4 mb-4"
          onPress={() => router.push('/(tabs)/declaracoes')}
        >
          <Text className="text-gray-400 mb-1">Última solicitação de declaração</Text>
          <Text className="text-gray-100 font-bold">
            {ultimaSolicitacaoEstado
              ? { PENDENTE: 'Pendente', EMITIDA: 'Emitida', REJEITADA: 'Rejeitada' }[ultimaSolicitacaoEstado]
              : 'Nenhuma solicitação ainda'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;
