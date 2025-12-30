import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import ActivityService from '@/storage/activity.service';
import EspecificActivityService from '@/storage/especificactivity.service';
import calculateTotals from '@/utils/calculateTotals';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';


type RouteParams = {
  nameActivity: string
}

const formatValue = (value: number) => {
  try {
    return `AKZ ${new Intl.NumberFormat('pt-PT').format(value)}`;
  } catch (e) {
    return `AKZ ${value}`;
  }
}

const Details = () => {
  const route = useRoute();
  const params = route.params as any;
  const idActivity = params.nameActivity || params.id || params.idActivity;
  const [activityMeta, setActivityMeta] = useState<ActivityTypeDTO | undefined>();
  const [items, setItems] = useState<EspecificActivityTypeDTO[]>([]);
  const [filterType, setFilterType] = useState<'todas' | 'receitas' | 'despesas'>('todas');
  const [sortNewest, setSortNewest] = useState(true);

  useFocusEffect(React.useCallback(() => {
    fetchDetails();
  }, [idActivity]));

  async function fetchDetails() {
    if (!idActivity) return;

    const service = new EspecificActivityService();
    const data = await service.getEspecificActivityById(idActivity);
    // ensure dates are Date objects
    const normalized = (data || []).map(i => ({ ...i, dataActivity: i.dataActivity ? new Date(i.dataActivity as any) : undefined }))
    setItems(normalized);

    // fetch activity meta (name, createAt)
    try {
      const activityService = new ActivityService();
      const meta = await activityService.getActivityById(idActivity);
      setActivityMeta(meta);
    } catch (e) {
      setActivityMeta(undefined);
    }
  }

  const totals = useMemo(() => calculateTotals(items), [items]);

  // period
  const period = useMemo(() => {
    if (!items || items.length === 0) return { start: '-', end: '-' };
    const sorted = [...items].sort((a, b) => (new Date(a.dataActivity || a.createAt || 0) as any) - (new Date(b.dataActivity || b.createAt || 0) as any));
    const start = sorted[0]?.dataActivity || sorted[0]?.createAt;
    const end = sorted[sorted.length - 1]?.dataActivity || sorted[sorted.length - 1]?.createAt;
    const fmt = (d?: Date) => d ? d.toLocaleDateString('pt-PT') : '-';
    return { start: fmt(new Date(start as any)), end: fmt(new Date(end as any)) };
  }, [items]);

  const filtered = useMemo(() => {
    return items
      .filter(i => filterType === 'todas' ? true : i.type === filterType)
      .sort((a, b) => {
        const da = new Date(a.dataActivity || a.createAt || 0).getTime();
        const db = new Date(b.dataActivity || b.createAt || 0).getTime();
        return sortNewest ? db - da : da - db;
      });
  }, [items, filterType, sortNewest]);

  const totalReceitas = totals.receitas || 0;
  const totalDespesas = totals.despesas || 0;
  const saldo = totalReceitas - totalDespesas;

  const Bar = ({ label, value, color }: { label: string; value: number; color: string }) => {
    const total = totalReceitas + totalDespesas || 1;
    const percent = Math.round((value / total) * 100);
    return (
      <View className='w-1/3 p-2'>
        <Text className='text-sm text-zinc-400'>{label}</Text>
        <View className='h-8 rounded-md mt-2' style={{ backgroundColor: '#0b0b0b' }}>
          <View style={{ width: `${percent}%`, height: '100%', backgroundColor: color, borderRadius: 6 }} />
        </View>
        <Text className='text-white mt-2'>{formatValue(value)}</Text>
      </View>
    );
  }

  return (
    <Container>
      <Header showBackButton />
      <Highliht title={activityMeta?.name || idActivity} subTitle="Ver mais detalhes" />

      <View className='mt-4'>
        <Text className='text-sm text-zinc-400'>Data de criação</Text>
        <Text className='text-white font-Roboto_700Bold'>{activityMeta?.createAt ? new Date(activityMeta.createAt as any).toLocaleDateString('pt-PT') : '-'}</Text>

        <Text className='text-sm text-zinc-400 mt-4'>Período dos registos</Text>
        <Text className='text-white'>{period.start} — {period.end}</Text>
      </View>

      {/* resumo financeiro */}
      {/* <View className='flex-row mt-6'>
        <Bar label="Receitas" value={totalReceitas} color="#00B37E" />
        <Bar label="Despesas" value={totalDespesas} color="#FF4D4F" />
        <View className='w-1/3 p-2'>
          <Text className='text-sm text-zinc-400'>Saldo</Text>
          <View className='h-8 rounded-md mt-2 bg-[#0b0b0b] items-center justify-center'>
            <Text className='text-white'>{formatValue(saldo)}</Text>
          </View>
        </View>
      </View> */}

      {/* filtros */}
      <View className='mt-6'>
        <View className='flex-row gap-2 mt-3'>
          <TouchableOpacity onPress={() => setFilterType('todas')} className={`p-2 rounded-md ${filterType === 'todas' ? 'bg-[#00B37E]' : 'bg-[#29292E]'}`}>
            <Text className='text-white'>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterType('receitas')} className={`p-2 rounded-md ${filterType === 'receitas' ? 'bg-[#00B37E]' : 'bg-[#29292E]'}`}>
            <Text className='text-white'>Receitas</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilterType('despesas')} className={`p-2 rounded-md ${filterType === 'despesas' ? 'bg-[#FF4D4F]' : 'bg-[#29292E]'}`}>
            <Text className='text-white'>Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSortNewest(s => !s)} className='ml-auto p-2 bg-[#29292E] rounded-md'>
            <Text className='text-white'>{sortNewest ? 'Mais recentes' : 'Mais antigos'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* gráficos simples */}
     {/*  <View className='mt-6'>
        <Text className='text-white'>Resumo Visual</Text>
        <View className='flex-row mt-3'>
          <View className='flex-1 p-2'>
            <Text className='text-xs text-zinc-400'>Receitas vs Despesas</Text>
            <View className='h-20 bg-[#121214] rounded-md mt-2 items-center justify-center'>
              <View style={{ flexDirection: 'row', width: '90%', height: 10, borderRadius: 6 }}>
                <View style={{ flex: totalReceitas, backgroundColor: '#00B37E', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }} />
                <View style={{ flex: totalDespesas, backgroundColor: '#FF4D4F', borderTopRightRadius: 6, borderBottomRightRadius: 6 }} />
              </View>
              <Text className='text-white mt-3'>{formatValue(totalReceitas)} vs {formatValue(totalDespesas)}</Text>
            </View>
          </View>

          <View className='flex-1 p-2'>
            <Text className='text-xs text-zinc-400'>Percentagem</Text>
            <View className='h-20 bg-[#121214] rounded-md mt-2 items-center justify-center'>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#0b0b0b', alignItems: 'center', justifyContent: 'center' }}>
                <Text className='text-white'>{totalReceitas + totalDespesas === 0 ? '—' : `${Math.round((totalDespesas / (totalReceitas + totalDespesas)) * 100)}% despesas`}</Text>
              </View>
            </View>
          </View>
        </View>
      </View> */}

      {/* lista de movimentos */}
      <View className='mt-6 flex-1'>
        <Text className='text-white mb-3'>Movimentos ({filtered.length})</Text>
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View className='w-full h-[68px] bg-[#29292E] rounded-md flex-row items-center mb-3 p-3'>
              <View style={{ width: 8, height: 40, borderRadius: 6, backgroundColor: item.type === 'receitas' ? '#00B37E' : '#FF4D4F' }} className='mr-3' />
              <View className='flex-1'>
                <Text className='text-white' style={{ fontFamily: 'Roboto_400Regular' }}>{item.name}</Text>
                <Text className='text-zinc-400 text-sm'>{item.dataActivity ? new Date(item.dataActivity as any).toLocaleDateString('pt-PT') : ''}</Text>
              </View>
              <Text className={`text-sm ${item.type === 'receitas' ? 'text-[#00B37E]' : 'text-[#FF4D4F]'}`}>{formatValue(item.value)}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <Text className='text-zinc-400'>Sem registos</Text>}
        />
      </View>

    </Container>
  );
}

export default Details;
