import { AppError } from '@/utils/AppError';
import { getToken } from '@/services/tokenStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean; // envia Authorization: Bearer <token> (default: true)
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!BASE_URL) {
    throw new AppError(
      'EXPO_PUBLIC_API_URL não está definido. Crie um ficheiro .env a partir de .env.example.',
    );
  }

  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new AppError('Não foi possível ligar ao servidor. Verifique a sua ligação à internet.');
  }

  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await response.json() : undefined;

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new AppError(message || 'Ocorreu um erro inesperado. Tente novamente.');
  }

  return data as T;
}

export async function uploadFile(
  path: string,
  file: { uri: string; name: string; type: string },
): Promise<{ filename: string; path: string; url: string }> {
  if (!BASE_URL) {
    throw new AppError(
      'EXPO_PUBLIC_API_URL não está definido. Crie um ficheiro .env a partir de .env.example.',
    );
  }

  const token = await getToken();
  const formData = new FormData();
  formData.append('file', { uri: file.uri, name: file.name, type: file.type } as any);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
  } catch (error) {
    throw new AppError('Não foi possível enviar o ficheiro. Verifique a sua ligação à internet.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new AppError(data?.message || 'Não foi possível enviar o ficheiro.');
  }
  return data;
}

export const httpClient = {
  get: <T>(path: string, auth = true) => request<T>(path, { method: 'GET', auth }),
  post: <T>(path: string, body?: unknown, auth = true) => request<T>(path, { method: 'POST', body, auth }),
  patch: <T>(path: string, body?: unknown, auth = true) => request<T>(path, { method: 'PATCH', body, auth }),
};
