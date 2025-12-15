import Cookies from 'js-cookie';
import { User } from '@/types';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const auth = {
  setSession: (token: string, user: User) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7 días
    Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7 });
  },

  clearSession: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },

  getToken: () => Cookies.get(TOKEN_KEY),

  getUser: (): User | null => {
    const userStr = Cookies.get(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    const token = Cookies.get(TOKEN_KEY);
    return !!token;
  }
};

