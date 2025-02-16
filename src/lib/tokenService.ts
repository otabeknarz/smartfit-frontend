interface Tokens {
  access: string;
  refresh: string;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const TokenService = {
  getTokens: (): Tokens | null => {
    const access = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    return access && refresh ? { access, refresh } : null;
  },

  setTokens: (tokens: Tokens) => {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
  },

  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAccessTokenExpired: (): boolean => {
    const tokens = TokenService.getTokens();
    if (!tokens?.access) return true;

    try {
      const decoded = JSON.parse(atob(tokens.access.split('.')[1])) as DecodedToken;
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}; 