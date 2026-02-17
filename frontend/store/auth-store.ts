import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User } from '@/types';

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	setAuth: (user: User, accessToken: string, refreshToken: string) => void;
	setTokens: (accessToken: string, refreshToken: string) => void;
	clearAuth: () => void;
	loadAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,

	setAuth: (user, accessToken, refreshToken) => {
		if (typeof window !== 'undefined') {
			Cookies.set('accessToken', accessToken, { expires: 7, sameSite: 'strict' });
			Cookies.set('refreshToken', refreshToken, { expires: 7, sameSite: 'strict' });
			Cookies.set('user', JSON.stringify(user), { expires: 7, sameSite: 'strict' });
		}
		set({
			user,
			accessToken,
			refreshToken,
			isAuthenticated: true,
		});
	},

	setTokens: (accessToken, refreshToken) => {
		if (typeof window !== 'undefined') {
			Cookies.set('accessToken', accessToken, { expires: 7, sameSite: 'strict' });
			Cookies.set('refreshToken', refreshToken, { expires: 7, sameSite: 'strict' });
		}
		set((state) => ({ ...state, accessToken, refreshToken, isAuthenticated: true }));
	},

	clearAuth: () => {
		if (typeof window !== 'undefined') {
			Cookies.remove('accessToken');
			Cookies.remove('refreshToken');
			Cookies.remove('user');
		}
		set({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
		});
	},

	loadAuthFromStorage: () => {
		if (typeof window !== 'undefined') {
			const accessToken = Cookies.get('accessToken');
			const refreshToken = Cookies.get('refreshToken');
			const userStr = Cookies.get('user');

			if (accessToken && refreshToken && userStr) {
				try {
					const user = JSON.parse(userStr) as User;
					set({
						user,
						accessToken,
						refreshToken,
						isAuthenticated: true,
					});
				} catch (error) {
					console.error('Failed to parse user from cookie', error);
				}
			}
		}
	},
}));
