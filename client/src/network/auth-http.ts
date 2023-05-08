import axios from 'axios';

import { Http } from './http';
import { User } from '@/types';

class AuthHttp extends Http {
  prefix = 'api/auth/';

  async loadUser(): Promise<User | null> {
    const res = await this.get<User | null>('me');

    return res.data;
  }

  async register(params: RegisterParams): Promise<AuthResponse> {
    const res = await this.post<AuthResponse>('register', params);

    return res.data;
  }

  async login(params: LoginParams): Promise<AuthResponse> {
    const res = await this.post<AuthResponse>('login', params);

    return res.data;
  }

  async logout() {
    return await this.get('logout');
  }

  async refresh(): Promise<AuthResponse> {
    const url = `${this.baseURL}/${this.prefix}refresh`;
    const res = await axios.get<AuthResponse>(url, { withCredentials: true });

    return res.data;
  }
}

export const authHttp = new AuthHttp();

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
