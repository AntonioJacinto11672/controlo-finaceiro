import { request } from './api';
import { CalendarioAssiduidade } from './types';

export const attendanceService = {
  calendarioMensal(ano: number, mes: number) {
    return request<CalendarioAssiduidade>(`/biometrico/attendance/me?ano=${ano}&mes=${mes}`);
  },
};
