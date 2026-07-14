export type TipoFalta = 'JUSTIFICADA' | 'INJUSTIFICADA';
export type EstadoAprovacaoFalta = 'PENDENTE' | 'APROVADA' | 'REJEITADA';
export type PrevisibilidadeFalta = 'PREVISIVEL' | 'CONHECIMENTO_SEMANA_ANTERIOR' | 'IMPREVISTA';

export type Falta = {
  id: string;
  id_funcionario: string;
  data: string;
  tipo: TipoFalta;
  motivo: string | null;
  documento_comprovativo: string | null;
  data_comunicacao: string | null;
  previsibilidade: PrevisibilidadeFalta | null;
  prazo_cumprido: boolean | null;
  estado_aprovacao: EstadoAprovacaoFalta;
  observacoes: string | null;
  valor_desconto: number | null;
  created_at: string;
};

export type JustificarFaltaInput = {
  motivo: string;
  previsibilidade: PrevisibilidadeFalta;
  data_comunicacao: string;
  documento_comprovativo?: string;
};
