import { httpClient } from './httpClient';
import { Funcionario } from '@/types/funcionario';

class AuthService {

  async solicitarCodigo(identificador: string): Promise<{ message: string }> {
    return httpClient.post('/auth/mobile/solicitar-codigo', { identificador }, false);
  }

  async verificarCodigo(
    identificador: string,
    codigo: string,
  ): Promise<{ access_token: string; funcionario: Funcionario }> {
    return httpClient.post('/auth/mobile/verificar-codigo', { identificador, codigo }, false);
  }
}

export default AuthService;
