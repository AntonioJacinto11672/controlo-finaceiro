export type EstadoSolicitacaoDocumento = 'PENDENTE' | 'EMITIDA' | 'REJEITADA';

export type TipoDocumento =
  | 'declaracao_ocupacao'
  | 'declaracao_salario'
  | 'declaracao_tempo_servico'
  | 'certidao_servico_publico'
  | 'declaracao_disponibilidade'
  | 'outra';

export const TIPOS_DOCUMENTO: { value: TipoDocumento; label: string }[] = [
  { value: 'declaracao_ocupacao', label: 'Declaração de Ocupação/Trabalho' },
  { value: 'declaracao_salario', label: 'Declaração de Salário' },
  { value: 'declaracao_tempo_servico', label: 'Declaração de Tempo de Serviço' },
  { value: 'certidao_servico_publico', label: 'Certidão de Serviço Público' },
  { value: 'declaracao_disponibilidade', label: 'Declaração de Disponibilidade' },
  { value: 'outra', label: 'Outra' },
];

export type SolicitacaoDocumento = {
  id: string;
  id_funcionario: string;
  tipo_documento: TipoDocumento;
  observacoes: string | null;
  estado: EstadoSolicitacaoDocumento;
  motivo_rejeicao: string | null;
  id_documento_emitido: string | null;
  created_at: string;
};

export type CreateSolicitacaoDocumentoInput = {
  tipo_documento: TipoDocumento;
  observacoes?: string;
};
