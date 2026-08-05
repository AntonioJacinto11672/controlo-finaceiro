import { request } from './api';
import { Funcionario } from './types';

export const authService = {
  solicitarCodigo(numero_agente: string, email: string) {
    return request<{ message: string }>('/auth/mobile/solicitar-codigo', {
      method: 'POST',
      body: { identificador: numero_agente || email, numero_agente, email },
      auth: false,
    });
  },

  verificarCodigo(numero_agente: string, email: string, codigo: string) {
    return request<{ access_token: string; funcionario: Funcionario }>('/auth/mobile/verificar-codigo', {
      method: 'POST',
      body: { identificador: numero_agente || email, numero_agente, email, codigo },
      auth: false,
    });
  },
};
