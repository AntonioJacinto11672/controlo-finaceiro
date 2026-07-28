import { request } from './api';
import { CreateLicencaInput, EstadoLicenca, Licenca, UploadResponse } from './types';

export const licencaService = {
  minhas(estado?: EstadoLicenca) {
    const query = estado ? `?estado=${estado}` : '';
    return request<Licenca[]>(`/licenca/me${query}`);
  },

  detalhe(id: string) {
    return request<Licenca>(`/licenca/${id}`);
  },

  criar(dto: CreateLicencaInput) {
    return request<Licenca>('/licenca/me', { method: 'POST', body: dto });
  },

  async upload(file: { uri: string; name: string; mimeType?: string | null }) {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'application/octet-stream',
    } as unknown as Blob);
    return request<UploadResponse>('/licenca/upload', { method: 'POST', formData });
  },
};
