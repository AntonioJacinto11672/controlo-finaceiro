import { request } from './api';
import { TipoLicenca } from './types';

export const tipoLicencaService = {
  listar() {
    return request<TipoLicenca[]>('/tipo-licenca?apenasAtivos=true');
  },
};
