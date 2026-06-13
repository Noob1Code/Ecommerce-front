// src/services/api/httpClient.ts

import axios, { 
  type InternalAxiosRequestConfig, 
  type AxiosResponse, 
  type AxiosError 
} from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// GLOBAL REQ INTERCEPTOR: Depura e mostra o JSON enviado antes de sair da rede
// ============================================================================
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Só abre o grupo de log se houver de fato um JSON sendo enviado no corpo (POST, PUT, PATCH)
    if (config.data) {
      console.group(`🚀 [HTTP REQ OUT] -> ${config.method?.toUpperCase()} | ${config.url}`);
      console.log('%cURL Destino:', 'color: #3b82f6; font-weight: bold;', config.baseURL ? `${config.baseURL}${config.url}` : config.url);
      console.log('%cJSON Payload Enviado:', 'color: #f59e0b; font-weight: bold;', JSON.parse(JSON.stringify(config.data)));
      console.log('Headers Ativos:', config.headers);
      console.groupEnd();
    }
    return config;
  },
  (error: unknown): Promise<unknown> => {
    console.error('❌ [HTTP REQ SETUP ERROR]: Falha ao estruturar a requisição local.', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// GLOBAL RES INTERCEPTOR: Intercepta e depura erros de integração e payloads
// ============================================================================
httpClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Captura e formata erros de rede (Ex: 400 Bad Request, 500 Internal Error, net::ERR_CONNECTION_REFUSED)
    console.group(`❌ [HTTP RES ERR] <- ${error.config?.method?.toUpperCase()} | ${error.config?.url}`);
    
    console.error(
      `Status do Servidor: ${error.response?.status || 'CONEXÃO RECUSADA/DESLIGADA (ERR_CONNECTION_REFUSED)'}`
    );

    // Mostra o JSON que tentou ser enviado e gerou o erro no backend
    if (error.config?.data) {
      try {
        console.warn('O JSON que você enviou foi:', JSON.parse(error.config.data));
      } catch {
        console.warn('O JSON que você enviou foi:', error.config.data);
      }
    }

    // Mostra a mensagem de erro ou validação exata que o Spring Boot devolveu
    if (error.response?.data) {
      console.error('Resposta de Erro do Java:', error.response.data);
    } else {
      console.error('Mensagem Nativa do Erro:', error.message);
    }

    console.groupEnd();
    return Promise.reject(error);
  }
);