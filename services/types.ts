export enum EstadoFuncionario {
  ATIVO = 'ATIVO',
  EM_LICENCA = 'EM_LICENCA',
  SUSPENSO = 'SUSPENSO',
  INATIVO = 'INATIVO',
}

export type Funcionario = {
  id: string;
  numero_agente: string;
  nome_completo: string;
  data_nascimento: string | null;
  sexo: string | null;
  bi: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  foto: string | null;
  biografia: string | null;
  data_entrada: string;
  ativo: boolean;
  estado: EstadoFuncionario;
  motivo_estado: string | null;
  seccao?: { id: string; nome: string };
  categoria?: { id: string; nome: string };
};

export enum EstadoLicenca {
  SOLICITADA = 'SOLICITADA',
  APROVADA = 'APROVADA',
  EM_CURSO = 'EM_CURSO',
  CONCLUIDA = 'CONCLUIDA',
  REJEITADA = 'REJEITADA',
  CANCELADA = 'CANCELADA',
}

export type TipoLicenca = {
  id: string;
  nome: string;
  descricao: string | null;
  dias_maximos: number | null;
  remunerada: boolean;
  prorrogavel: boolean;
  dias_prorrogacao_maxima: number | null;
  exige_documento: boolean;
  requer_tres_anos_servico: boolean;
  ativo: boolean;
};

export type Licenca = {
  id: string;
  id_funcionario: string;
  id_tipo_licenca: string;
  data_inicio: string;
  data_fim_prevista: string;
  data_fim_real: string | null;
  dias_concedidos: number;
  documento_comprovativo: string | null;
  estado: EstadoLicenca;
  motivo: string | null;
  observacoes: string | null;
  tipoLicenca?: TipoLicenca;
  funcionario?: Funcionario;
  aprovadoPor?: { id: string; email?: string | null; name?: string };
  id_documento_emitido?: string | null;
  documentoEmitido?: {
    id: string;
    numero_referencia: string;
    tipo_documento: string;
    nome_funcionario: string;
    cargo: string;
    departamento: string;
    salario_base: number | null;
    data_emissao: string;
    nome_secretaria: string;
    emitido_por: string;
    endereco_tribunal: string;
    conteudo_json: string | null;
    status: string;
    observacoes: string | null;
  };
  created_at: string;
};

export type CreateLicencaInput = {
  id_tipo_licenca: string;
  data_inicio: string;
  data_fim_prevista: string;
  dias_concedidos: number;
  documento_comprovativo?: string;
  motivo?: string;
  observacoes?: string;
};

export enum TipoFalta {
  JUSTIFICADA = 'JUSTIFICADA',
  INJUSTIFICADA = 'INJUSTIFICADA',
}

export enum EstadoAprovacaoFalta {
  PENDENTE = 'PENDENTE',
  APROVADA = 'APROVADA',
  REJEITADA = 'REJEITADA',
}

export enum PrevisibilidadeFalta {
  PREVISIVEL = 'PREVISIVEL',
  CONHECIMENTO_SEMANA_ANTERIOR = 'CONHECIMENTO_SEMANA_ANTERIOR',
  IMPREVISTA = 'IMPREVISTA',
}

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
  created_at: string;
};

export type JustificarFaltaInput = {
  motivo: string;
  previsibilidade: PrevisibilidadeFalta;
  data_comunicacao: string;
  documento_comprovativo?: string;
};

export type UploadResponse = {
  filename: string;
  path: string;
  url: string;
};

export type DiaAssiduidade = {
  att_date: string;
  checkin: string | null;
  checkout: string | null;
  workedMinutes: number | null;
  remark: string | null;
  entrada_esperada: string | null;
  estado: 'presente' | 'atrasado' | 'saida_antecipada' | 'ausente';
};

export enum EstadoSolicitacaoDocumento {
  PENDENTE = 'PENDENTE',
  EMITIDA = 'EMITIDA',
  REJEITADA = 'REJEITADA',
}

export type TipoDocumento =
  | 'declaracao_ocupacao'
  | 'declaracao_salario'
  | 'declaracao_tempo_servico'
  | 'certidao_servico_publico'
  | 'declaracao_disponibilidade'
  | 'outra';

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

export type CalendarioAssiduidade = {
  erro?: string;
  funcionario?: { emp_pin: string; nome: string; departamento: string | null; emp_photo: string | null };
  periodo?: { ano: number; mes: number; dataInicio: string; dataFim: string };
  dias?: DiaAssiduidade[];
  resumo?: {
    diasPresente: number;
    diasAtrasado: number;
    totalHorasTrabalhadas: number;
    totalPausasHoras: number;
  };
};
