import { EstadoAprovacaoFalta, EstadoLicenca, EstadoSolicitacaoDocumento, TipoDocumento } from '@/services/types';

export function formatDate(value: string | null | undefined): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const ESTADO_LICENCA_LABEL: Record<EstadoLicenca, string> = {
  [EstadoLicenca.SOLICITADA]: 'Solicitada',
  [EstadoLicenca.APROVADA]: 'Aprovada',
  [EstadoLicenca.EM_CURSO]: 'Em curso',
  [EstadoLicenca.CONCLUIDA]: 'Concluída',
  [EstadoLicenca.REJEITADA]: 'Rejeitada',
  [EstadoLicenca.CANCELADA]: 'Cancelada',
};

export const ESTADO_LICENCA_COLOR: Record<EstadoLicenca, string> = {
  [EstadoLicenca.SOLICITADA]: '#F5A623',
  [EstadoLicenca.APROVADA]: '#00875F',
  [EstadoLicenca.EM_CURSO]: '#2D9CDB',
  [EstadoLicenca.CONCLUIDA]: '#7C7C8A',
  [EstadoLicenca.REJEITADA]: '#F75A68',
  [EstadoLicenca.CANCELADA]: '#F75A68',
};

export const ESTADO_FALTA_LABEL: Record<EstadoAprovacaoFalta, string> = {
  [EstadoAprovacaoFalta.PENDENTE]: 'Pendente',
  [EstadoAprovacaoFalta.APROVADA]: 'Aprovada',
  [EstadoAprovacaoFalta.REJEITADA]: 'Rejeitada',
};

export const ESTADO_FALTA_COLOR: Record<EstadoAprovacaoFalta, string> = {
  [EstadoAprovacaoFalta.PENDENTE]: '#F5A623',
  [EstadoAprovacaoFalta.APROVADA]: '#00875F',
  [EstadoAprovacaoFalta.REJEITADA]: '#F75A68',
};

export const TIPO_DOCUMENTO_LABEL: Record<TipoDocumento, string> = {
  declaracao_ocupacao: 'Declaração de ocupação',
  declaracao_salario: 'Declaração de salário',
  declaracao_tempo_servico: 'Declaração de tempo de serviço',
  certidao_servico_publico: 'Certidão de serviço público',
  declaracao_disponibilidade: 'Declaração de disponibilidade',
  outra: 'Outra',
};

export const ESTADO_SOLICITACAO_LABEL: Record<EstadoSolicitacaoDocumento, string> = {
  [EstadoSolicitacaoDocumento.PENDENTE]: 'Pendente',
  [EstadoSolicitacaoDocumento.EMITIDA]: 'Emitida',
  [EstadoSolicitacaoDocumento.REJEITADA]: 'Rejeitada',
};

export const ESTADO_SOLICITACAO_COLOR: Record<EstadoSolicitacaoDocumento, string> = {
  [EstadoSolicitacaoDocumento.PENDENTE]: '#F5A623',
  [EstadoSolicitacaoDocumento.EMITIDA]: '#00875F',
  [EstadoSolicitacaoDocumento.REJEITADA]: '#F75A68',
};
