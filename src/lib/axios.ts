import axios, { AxiosError } from 'axios';
import { API_BASE_URL, API_URLS } from '@/constants/api';
import { TokenService } from './tokenService';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Add auth token to requests
instance.interceptors.request.use(
  async (config) => {
    if (TokenService.isAccessTokenExpired()) {
      if (!isRefreshing) {
        isRefreshing = true;
        const tokens = TokenService.getTokens();

        if (tokens?.refresh) {
          try {
            const response = await axios.post(API_URLS.REFRESH_TOKEN, {
              refresh: tokens.refresh
            });
            TokenService.setTokens(response.data);
            processQueue(null);
          } catch (error) {
            processQueue(error);
            TokenService.clearTokens();
            if (window.Telegram?.WebApp) {
              // window.Telegram.WebApp.close();
            }
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        const tokens = TokenService.getTokens();
        if (tokens?.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`;
        }
        return config;
      }).catch(error => {
        return Promise.reject(error);
      });
    }

    const tokens = TokenService.getTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      TokenService.clearTokens();
      if (window.Telegram?.WebApp) {
        // window.Telegram.WebApp.close();
      }
    }
    return Promise.reject(error);
  }
);

export default instance; 