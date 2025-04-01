export const API_URLS = {
  // Auth endpoints
  LOGIN: "/users/login/",
  LOGOUT: "/users/logout/",
  REFRESH_TOKEN: "/users/token/refresh/",
  GET_ME: "/users/get-me/",

  // User endpoints
  GET_USERS: "/users/get/",
  CREATE_USER: "/users/create/",
  UPDATE_USER: (id: string) => `/users/update/${id}/`,
  GET_MY_SESSIONS: "/users/get-my-sessions/",
  CREATE_ONBOARDING_ANSWERS: "/users/create-onboarding-answers/",
};
