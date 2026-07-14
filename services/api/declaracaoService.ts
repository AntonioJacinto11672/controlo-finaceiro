import { httpClient } from './httpClient';
import { CreateSolicitacaoDocumentoInput, SolicitacaoDocumento } from '@/types/solicitacaoDocumento';

class DeclaracaoService {
  async listarMinhasSolicitacoes(): Promise<SolicitacaoDocumento[]> {
    return httpClient.get('/solicitacao-documento/me');
  }

  async criarSolicitacao(dto: CreateSolicitacaoDocumentoInput): Promise<SolicitacaoDocumento> {
    return httpClient.post('/solicitacao-documento/me', dto);
  }
}

export default DeclaracaoService;
