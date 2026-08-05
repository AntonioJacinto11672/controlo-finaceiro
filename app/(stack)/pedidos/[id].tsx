import Container from '@/components/Container';
import Header from '@/components/Header';
import Loading from '@/components/Loanding';
import StatusBadge from '@/components/StatusBadge';
import { licencaService } from '@/services/licenca.service';
import { Licenca } from '@/services/types';
import { ESTADO_LICENCA_COLOR, ESTADO_LICENCA_LABEL, formatDate } from '@/utils/format';
import { resolveUploadUrl } from '@/services/api';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const LicencaDetalheScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [licenca, setLicenca] = useState<Licenca | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await licencaService.detalhe(id);
        setLicenca(data);
      } catch (error: any) {
        Alert.alert('Pedido', error?.message || 'Não foi possível carregar o pedido.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  if (isLoading) {
    return (
      <Container>
        <Header showBackButton />
        <Loading />
      </Container>
    );
  }

  if (!licenca) {
    return (
      <Container>
        <Header showBackButton />
        <Text className="text-gray-400 text-center mt-8">Pedido não encontrado.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Header showBackButton />
      <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
        <View className="flex-row justify-between items-start mb-4">
          <Text className="text-white text-xl font-bold flex-1 mr-2">
            {licenca.tipoLicenca?.nome ?? 'Licença'}
          </Text>
          <StatusBadge
            label={ESTADO_LICENCA_LABEL[licenca.estado]}
            color={ESTADO_LICENCA_COLOR[licenca.estado]}
          />
        </View>

        <View className="bg-[#121214] rounded-xl p-4 mb-3">
          <Text className="text-gray-400 text-xs mb-1">Período</Text>
          <Text className="text-white">
            {formatDate(licenca.data_inicio)} — {formatDate(licenca.data_fim_prevista)}
          </Text>
          {licenca.data_fim_real && (
            <Text className="text-gray-400 text-xs mt-1">Fim real: {formatDate(licenca.data_fim_real)}</Text>
          )}
        </View>

        <View className="bg-[#121214] rounded-xl p-4 mb-3">
          <Text className="text-gray-400 text-xs mb-1">Dias concedidos</Text>
          <Text className="text-white">{licenca.dias_concedidos}</Text>
        </View>

        {licenca.motivo && (
          <View className="bg-[#121214] rounded-xl p-4 mb-3">
            <Text className="text-gray-400 text-xs mb-1">Motivo</Text>
            <Text className="text-white">{licenca.motivo}</Text>
          </View>
        )}

        {licenca.observacoes && (
          <View className="bg-[#121214] rounded-xl p-4 mb-3">
            <Text className="text-gray-400 text-xs mb-1">Observações</Text>
            <Text className="text-white">{licenca.observacoes}</Text>
          </View>
        )}

        {licenca.funcionario && (
          <View className="bg-[#121214] rounded-xl p-4 mb-3">
            <Text className="text-gray-400 text-xs mb-1">Funcionário</Text>
            <Text className="text-white text-base">{licenca.funcionario.nome_completo}</Text>
            <Text className="text-gray-400 text-xs mt-2">Número de agente</Text>
            <Text className="text-white text-base">{licenca.funcionario.numero_agente}</Text>
            {licenca.funcionario.seccao?.nome && (
              <>
                <Text className="text-gray-400 text-xs mt-2">Secção</Text>
                <Text className="text-white text-base">{licenca.funcionario.seccao.nome}</Text>
              </>
            )}
            {licenca.funcionario.categoria?.nome && (
              <>
                <Text className="text-gray-400 text-xs mt-2">Categoria</Text>
                <Text className="text-white text-base">{licenca.funcionario.categoria.nome}</Text>
              </>
            )}
          </View>
        )}

        {licenca.documento_comprovativo ? (
          <TouchableOpacity
            className="bg-[#121214] rounded-xl p-4 mb-3"
            onPress={() => Linking.openURL(resolveUploadUrl(licenca.documento_comprovativo)!)}
          >
            <Text className="text-gray-400 text-xs mb-1">Documento comprovativo</Text>
            <Text className="text-[#00875F]">Abrir documento comprovativo</Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-[#121214] rounded-xl p-4 mb-3">
            <Text className="text-gray-400 text-xs mb-1">Documento comprovativo</Text>
            <Text className="text-white">Ainda não foi enviado o comprovativo desta licença.</Text>
          </View>
        )}

        {licenca.documentoEmitido ? (
          <View className="bg-[#121214] rounded-xl p-4 mb-3">
            <Text className="text-gray-400 text-xs mb-1">Documento oficial emitido</Text>
            <Text className="text-white font-semibold">{licenca.documentoEmitido.numero_referencia}</Text>
            <Text className="text-gray-400 text-xs mt-2">Tipo</Text>
            <Text className="text-white">{licenca.documentoEmitido.tipo_documento}</Text>
            <Text className="text-gray-400 text-xs mt-2">Emitido por</Text>
            <Text className="text-white">{licenca.documentoEmitido.emitido_por}</Text>
            <Text className="text-gray-400 text-xs mt-2">Data de emissão</Text>
            <Text className="text-white">{formatDate(licenca.documentoEmitido.data_emissao)}</Text>
            <Text className="text-gray-400 text-xs mt-2">Estado</Text>
            <Text className="text-white">{licenca.documentoEmitido.status}</Text>
            {licenca.documentoEmitido.observacoes && (
              <>
                <Text className="text-gray-400 text-xs mt-2">Observações do documento</Text>
                <Text className="text-white">{licenca.documentoEmitido.observacoes}</Text>
              </>
            )}
          </View>
        ) : (
          <View className="bg-[#121214] rounded-xl p-4 mb-3">
            <Text className="text-gray-400 text-xs mb-1">Documento oficial</Text>
            <Text className="text-white">Ainda não foi emitido documento oficial para esta licença.</Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default LicencaDetalheScreen;
