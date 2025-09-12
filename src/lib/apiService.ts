import axios from "axios";
import { TokenService } from "./tokenService";

const API_URL = "http://127.0.0.1:8000/api";

export const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use((config) => {
	const token = TokenService.getToken();
	if (token) {
		config.headers.Authorization = `Token ${token}`;
	}
	return config;
});

export interface User {
	id: string;
	// Add other user fields as needed
}

export interface Session {
	id: number;
	ip_address: string;
	device_info: string;
	created_at: string;
}

export interface LoginResponse {
	token: string;
	has_registered_successfully: boolean;
}

export const AuthService = {
	login: async (telegramId: string) => {
		try {
			const response = await axiosInstance.post<LoginResponse>(
				"/users/login/",
				{
					id: telegramId,
				}
			);
			TokenService.setToken(response.data.token);
			return response.data;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	},

	logout: async () => {
		try {
			await axiosInstance.get("/users/logout/");
			TokenService.clearToken();
			return true;
		} catch (error) {
			console.error("Logout error:", error);
			throw error;
		}
	},

	getMe: async (): Promise<User> => {
		const response = await axiosInstance.get("/users/get-me/");
		return response.data;
	},

	getMySessions: async (): Promise<Session[]> => {
		const response = await axiosInstance.get("/users/get-my-sessions/");
		return response.data;
	},
};
