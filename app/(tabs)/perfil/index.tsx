import Button from '@/components/Button';
import Container from '@/components/Container';
import Header from '@/components/Header';
import Highliht from '@/components/Highliht';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Text, View } from 'react-native';

const ESTADO_LABEL: Record<string, string> = {
  ATIVO: 'Ativo',
  EM_LICENCA: 'Em licença',
  SUSPENSO: 'Suspenso',
  INATIVO: 'Inativo',
};

function Campo({ label, value }: { label: string; value?: string | null }) {
  return (
    <View className="mb-4">
      <Text className="text-gray-400 mb-1">{label}</Text>
      <Text className="text-gray-100 font-semibold">{value || '—'}</Text>
    </View>
  );
}

const PerfilScreen = () => {
  const { funcionario, logout } = useAuth();

  return (
    <Container>
      <Header />
      <Highliht title="Perfil" subTitle="Os seus dados no TCL" />

      <View className="bg-[#29292E] rounded-md p-4 mb-6">
        <Campo label="Nome completo" value={funcionario?.nome_completo} />
        <Campo label="Número de agente" value={funcionario?.numero_agente} />
        <Campo label="Email" value={funcionario?.email} />
        <Campo label="Telefone" value={funcionario?.telefone} />
        <Campo label="Estado" value={funcionario ? ESTADO_LABEL[funcionario.estado] : undefined} />
      </View>

      <Button title="Sair" type="SECONDARY" onPress={logout} />
    </Container>
  );
};

export default PerfilScreen;
