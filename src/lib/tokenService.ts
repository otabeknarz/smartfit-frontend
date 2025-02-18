interface Token {
  token: string;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const TokenService = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  // This method might not be needed since DRF tokens don't expire
  isTokenValid: (): boolean => {
    return !!TokenService.getToken();
  }
}; 