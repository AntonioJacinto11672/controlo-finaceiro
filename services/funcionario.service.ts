import { request } from './api';
import { Funcionario } from './types';

export const funcionarioService = {
  me() {
    return request<Funcionario>('/funcionario/me');
  },
};
