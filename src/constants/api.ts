export const API_BASE_URL = 'http://localhost:8000/api/users';

export const API_URLS = {
  // Auth endpoints
  GET_CSRF_TOKEN: `${API_BASE_URL}/get-csrf-token/`,
  LOGIN: `${API_BASE_URL}/login/`,
  LOGOUT: `${API_BASE_URL}/logout/`,
  GET_ME: `${API_BASE_URL}/get-me/`,
  
  // User endpoints
  GET_USERS: `${API_BASE_URL}/get/`,
  CREATE_USER: `${API_BASE_URL}/create/`,
  UPDATE_USER: (id: string) => `${API_BASE_URL}/update/${id}/`,
  GET_MY_SESSIONS: `${API_BASE_URL}/get-my-sessions/`,
}; 