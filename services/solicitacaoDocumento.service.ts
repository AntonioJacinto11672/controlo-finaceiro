import { request } from './api';
import { CreateSolicitacaoDocumentoInput, SolicitacaoDocumento } from './types';

export const solicitacaoDocumentoService = {
  minhas() {
    return request<SolicitacaoDocumento[]>('/solicitacao-documento/me');
  },

  criar(dto: CreateSolicitacaoDocumentoInput) {
    return request<SolicitacaoDocumento>('/solicitacao-documento/me', { method: 'POST', body: dto });
  },
};
