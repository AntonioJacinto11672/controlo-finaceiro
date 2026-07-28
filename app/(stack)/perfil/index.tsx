import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import Loading from '@/components/Loanding';
import { useAuth } from '@/contexts/AuthContext';
import { funcionarioService } from '@/services/funcionario.service';
import { Funcionario } from '@/services/types';
import { formatDate } from '@/utils/format';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const PerfilScreen = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        try {
          setIsLoading(true);
          const data = await funcionarioService.me();
          if (ativo) setFuncionario(data);
        } catch (error: any) {
          Alert.alert('Perfil', error?.message || 'Não foi possível carregar o teu perfil.');
        } finally {
          if (ativo) setIsLoading(false);
        }
      })();
      return () => {
        ativo = false;
      };
    }, []),
  );

  const confirmarLogout = () => {
    Alert.alert('Sair', 'Queres terminar sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Container>
      <Header />
      <Highliht title="Perfil" subTitle="Os teus dados no RH" />

      {isLoading ? (
        <Loading />
      ) : !funcionario ? (
        <Text className="text-gray-400 text-center mt-8">Não foi possível carregar o perfil.</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="bg-[#121214] rounded-xl p-4 mb-3">
            <Text className="text-gray-400 text-xs mb-1">Nome</Text>
            <Text className="text-white text-base">{funcionario.nome_completo}</Text>
          </View>

          <View className="bg-[#121214] rounded-xl p-4 mb-3">
            <Text className="text-gray-400 text-xs mb-1">Número de agente</Text>
            <Text className="text-white text-base">{funcionario.numero_agente}</Text>
          </View>

          {funcionario.seccao?.nome && (
            <View className="bg-[#121214] rounded-xl p-4 mb-3">
              <Text className="text-gray-400 text-xs mb-1">Secção</Text>
              <Text className="text-white text-base">{funcionario.seccao.nome}</Text>
            </View>
          )}

          {funcionario.categoria?.nome && (
            <View className="bg-[#121214] rounded-xl p-4 mb-3">
              <Text className="text-gray-400 text-xs mb-1">Categoria</Text>
              <Text className="text-white text-base">{funcionario.categoria.nome}</Text>
            </View>
          )}

          {funcionario.email && (
            <View className="bg-[#121214] rounded-xl p-4 mb-3">
              <Text className="text-gray-400 text-xs mb-1">Email</Text>
              <Text className="text-white text-base">{funcionario.email}</Text>
            </View>
          )}

          {funcionario.telefone && (
            <View className="bg-[#121214] rounded-xl p-4 mb-3">
              <Text className="text-gray-400 text-xs mb-1">Telefone</Text>
              <Text className="text-white text-base">{funcionario.telefone}</Text>
            </View>
          )}

          <View className="bg-[#121214] rounded-xl p-4 mb-3">
            <Text className="text-gray-400 text-xs mb-1">Data de entrada</Text>
            <Text className="text-white text-base">{formatDate(funcionario.data_entrada)}</Text>
          </View>

          <TouchableOpacity
            className="py-3 mt-4 bg-[#AA2834] rounded-xl mb-8"
            onPress={confirmarLogout}
          >
            <Text className="font-bold text-center text-white">Terminar sessão</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </Container>
  );
};

export default PerfilScreen;
