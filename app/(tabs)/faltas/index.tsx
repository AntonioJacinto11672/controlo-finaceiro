import Container from '@/components/Container';
import Filter from '@/components/Filter';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import ListEmpity from '@/components/ListEmpity';
import Loading from '@/components/Loanding';
import StatusBadge from '@/components/StatusBadge';
import FaltaService from '@/services/api/faltaService';
import { Falta } from '@/types/falta';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const faltaService = new FaltaService();

type FiltroEstado = 'TODAS' | 'PENDENTE' | 'APROVADA' | 'REJEITADA';

const FILTROS: { key: FiltroEstado; title: string }[] = [
  { key: 'TODAS', title: 'Todas' },
  { key: 'PENDENTE', title: 'Pendente' },
  { key: 'APROVADA', title: 'Aprovada' },
  { key: 'REJEITADA', title: 'Rejeitada' },
];

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-PT');
}

function badgeDaFalta(falta: Falta) {
  if (falta.estado_aprovacao === 'PENDENTE') return { label: 'Pendente', tone: 'pending' as const };
  if (falta.estado_aprovacao === 'APROVADA') return { label: 'Justificada', tone: 'success' as const };
  return { label: 'Rejeitada', tone: 'danger' as const };
}

const FaltasScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [faltas, setFaltas] = useState<Falta[]>([]);
  const [filtro, setFiltro] = useState<FiltroEstado>('TODAS');

  const carregar = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await faltaService.listarMinhasFaltas();
      setFaltas(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const faltasFiltradas = filtro === 'TODAS' ? faltas : faltas.filter((f) => f.estado_aprovacao === filtro);

  return (
    <Container>
      <Header />
      <Highliht title="As minhas faltas" subTitle="Consulte e justifique as suas faltas" />

      <FlatList
        data={FILTROS}
        horizontal
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <Filter title={item.title} isActive={filtro === item.key} onPress={() => setFiltro(item.key)} />
        )}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={faltasFiltradas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={faltasFiltradas.length === 0 ? { flex: 1 } : { gap: 8, paddingTop: 8 }}
          ListEmptyComponent={() => <ListEmpity message="Nenhuma falta encontrada" />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const badge = badgeDaFalta(item);
            return (
              <TouchableOpacity
                className="bg-[#29292E] rounded-md p-4 flex-row justify-between items-center"
                onPress={() => router.push(`/(tabs)/faltas/${item.id}`)}
              >
                <View>
                  <Text className="text-gray-100 font-bold mb-1">{formatarData(item.data)}</Text>
                  <Text className="text-gray-400">{item.tipo === 'JUSTIFICADA' ? 'Justificada' : 'Injustificada'}</Text>
                </View>
                <StatusBadge label={badge.label} tone={badge.tone} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </Container>
  );
};

export default FaltasScreen;
