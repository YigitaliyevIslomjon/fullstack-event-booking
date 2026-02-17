import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

apiClient.interceptors.request.use(
	(config) => {
		if (typeof window !== 'undefined') {
			const token = useAuthStore.getState().accessToken;
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refreshToken = useAuthStore.getState().refreshToken;

			if (refreshToken) {
				try {
					const response = await axios.post(
						`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
						{ refreshToken }
					);
					const { accessToken, refreshToken: newRefreshToken } = response.data;
					useAuthStore.getState().setTokens(accessToken, newRefreshToken);
					originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					return apiClient(originalRequest);
				} catch (refreshError) {
					useAuthStore.getState().clearAuth();
					if (typeof window !== 'undefined') {
						window.location.href = '/login';
					}
					return Promise.reject(refreshError);
				}
			}
		}

		return Promise.reject(error);
	}
);

export default apiClient;
