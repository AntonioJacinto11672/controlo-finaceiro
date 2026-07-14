import { httpClient } from './httpClient';
import { Funcionario } from '@/types/funcionario';

class FuncionarioService {
  async obterMeuPerfil(): Promise<Funcionario> {
    return httpClient.get('/funcionario/me');
  }
}

export default FuncionarioService;
