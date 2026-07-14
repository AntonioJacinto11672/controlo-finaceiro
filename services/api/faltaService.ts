import { httpClient, uploadFile } from './httpClient';
import { Falta, JustificarFaltaInput } from '@/types/falta';

class FaltaService {
  async listarMinhasFaltas(): Promise<Falta[]> {
    return httpClient.get('/falta/me');
  }

  async obterFalta(id: string): Promise<Falta> {
    return httpClient.get(`/falta/${id}`);
  }

  async justificarFalta(id: string, dto: JustificarFaltaInput): Promise<Falta> {
    return httpClient.patch(`/falta/${id}/justificar`, dto);
  }

  async uploadDocumento(file: { uri: string; name: string; type: string }) {
    return uploadFile('/falta/upload', file);
  }
}

export default FaltaService;
