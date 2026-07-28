import { request } from './api';
import { Falta, JustificarFaltaInput, UploadResponse } from './types';

export const faltaService = {
  minhas() {
    return request<Falta[]>('/falta/me');
  },

  justificar(id: string, dto: JustificarFaltaInput) {
    return request<Falta>(`/falta/${id}/justificar`, { method: 'PATCH', body: dto });
  },

  async upload(file: { uri: string; name: string; mimeType?: string | null }) {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'application/octet-stream',
    } as unknown as Blob);
    return request<UploadResponse>('/falta/upload', { method: 'POST', formData });
  },
};
