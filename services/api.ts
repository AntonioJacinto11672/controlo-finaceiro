import { AppError } from '@/utils/AppError';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ||" http://localhost:3000/api";
const TOKEN_KEY = 'tcl-rh-access-token';

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  formData?: FormData;
};

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (Array.isArray(data?.message)) return data.message.join('\n');
    if (typeof data?.message === 'string') return data.message;
    return 'Ocorreu um erro inesperado. Tente novamente.';
  } catch {
    return 'Ocorreu um erro inesperado. Tente novamente.';
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new AppError('EXPO_PUBLIC_API_URL não está configurado. Verifica o ficheiro .env.');
  }

  const { method = 'GET', body, auth = true, formData } = options;
  const headers: Record<string, string> = {};

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let requestBody: BodyInit | undefined;
  if (formData) {
    requestBody = formData;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  let response: Response;
  try {
    console.log("Rota api link", API_URL + path)
    response = await fetch(`${API_URL}${path}`, { method, headers, body: requestBody });
  } catch {
    throw new AppError('Não foi possível ligar ao servidor. Verifica a tua ligação à internet.');
  }

  if (!response.ok) {
    throw new AppError(await extractErrorMessage(response));
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
