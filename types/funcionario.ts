export type EstadoFuncionario = 'ATIVO' | 'EM_LICENCA' | 'SUSPENSO' | 'INATIVO';

export type Funcionario = {
  id: string;
  numero_agente: string;
  nome_completo: string;
  email: string | null;
  telefone: string | null;
  foto: string | null;
  estado: EstadoFuncionario;
  data_entrada: string;
  seccao?: { id: string; nome?: string } | null;
  categoria?: { id: string; nome?: string } | null;
};
