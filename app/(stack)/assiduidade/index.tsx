import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import ListEmpity from '@/components/ListEmpity';
import Loading from '@/components/Loanding';
import StatusBadge from '@/components/StatusBadge';
import { attendanceService } from '@/services/attendance.service';
import { faltaService } from '@/services/falta.service';
import { CalendarioAssiduidade, EstadoAprovacaoFalta, Falta } from '@/services/types';
import { formatDate } from '@/utils/format';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { CaretLeftIcon, CaretRightIcon } from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ESTADO_DIA_LABEL: Record<string, string> = {
  presente: 'Presente',
  atrasado: 'Atrasado',
  saida_antecipada: 'Saída antecipada',
  ausente: 'Ausente',
};

const ESTADO_DIA_COLOR: Record<string, string> = {
  presente: '#00875F',
  atrasado: '#F5A623',
  saida_antecipada: '#F5A623',
  ausente: '#F75A68',
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const AssiduidadeScreen = () => {
  const router = useRouter();
  const now = new Date();
  const [ano, setAno] = useState(now.getFullYear());
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [isLoading, setIsLoading] = useState(true);
  const [calendario, setCalendario] = useState<CalendarioAssiduidade | null>(null);
  const [faltasPendentes, setFaltasPendentes] = useState<Falta[]>([]);

  const carregar = useCallback(async () => {
    try {
      setIsLoading(true);
      const [dadosCalendario, faltas] = await Promise.all([
        attendanceService.calendarioMensal(ano, mes),
        faltaService.minhas(),
      ]);
      setCalendario(dadosCalendario);
      setFaltasPendentes(
        faltas.filter((f) => f.estado_aprovacao === EstadoAprovacaoFalta.PENDENTE && !f.motivo),
      );
    } catch (error: any) {
      Alert.alert('Assiduidade', error?.message || 'Não foi possível carregar a assiduidade.');
    } finally {
      setIsLoading(false);
    }
  }, [ano, mes]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const mudarMes = (delta: number) => {
    let novoMes = mes + delta;
    let novoAno = ano;
    if (novoMes < 1) {
      novoMes = 12;
      novoAno -= 1;
    } else if (novoMes > 12) {
      novoMes = 1;
      novoAno += 1;
    }
    setMes(novoMes);
    setAno(novoAno);
  };

  return (
    <Container>
      <Header />
      <Highliht title="Assiduidade" subTitle="O teu registo de presenças" />

      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={() => mudarMes(-1)} className="p-2">
          <CaretLeftIcon color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-base">
          {MESES[mes - 1]} {ano}
        </Text>
        <TouchableOpacity onPress={() => mudarMes(1)} className="p-2">
          <CaretRightIcon color="white" size={24} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {calendario?.erro ? (
            <Text className="text-gray-400 text-center mt-8">{calendario.erro}</Text>
          ) : (
            <>
              {calendario?.resumo && (
                <View className="flex-row justify-between bg-[#121214] rounded-xl p-4 mb-4">
                  <View className="items-center flex-1">
                    <Text className="text-white font-bold text-lg">{calendario.resumo.diasPresente}</Text>
                    <Text className="text-gray-400 text-xs">Presenças</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="text-white font-bold text-lg">{calendario.resumo.diasAtrasado}</Text>
                    <Text className="text-gray-400 text-xs">Atrasos</Text>
                  </View>
                  <View className="items-center flex-1">
                    <Text className="text-white font-bold text-lg">{calendario.resumo.totalHorasTrabalhadas}h</Text>
                    <Text className="text-gray-400 text-xs">Horas</Text>
                  </View>
                </View>
              )}

              {(calendario?.dias ?? []).map((dia) => (
                <View
                  key={dia.att_date}
                  className="flex-row justify-between items-center bg-[#121214] rounded-xl p-3 mb-2"
                >
                  <Text className="text-white">{formatDate(dia.att_date)}</Text>
                  <StatusBadge
                    label={ESTADO_DIA_LABEL[dia.estado] ?? dia.estado}
                    color={ESTADO_DIA_COLOR[dia.estado] ?? '#7C7C8A'}
                  />
                </View>
              ))}

              {(calendario?.dias ?? []).length === 0 && (
                <ListEmpity message="Sem registos de assiduidade neste mês" />
              )}
            </>
          )}

          {faltasPendentes.length > 0 && (
            <View className="mt-6">
              <Text className="text-white font-semibold mb-3">Faltas por justificar</Text>
              {faltasPendentes.map((falta) => (
                <TouchableOpacity
                  key={falta.id}
                  className="flex-row justify-between items-center bg-[#121214] rounded-xl p-3 mb-2 border border-[#F5A623]"
                  onPress={() =>
                    router.push({ pathname: '/(stack)/assiduidade/justificar/[id]', params: { id: falta.id } })
                  }
                >
                  <Text className="text-white">{formatDate(falta.data)}</Text>
                  <Text className="text-[#F5A623] font-semibold">Justificar</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View className="h-8" />
        </ScrollView>
      )}
    </Container>
  );
};

export default AssiduidadeScreen;
