import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api, setTokens, clearTokens, getToken } from '../lib/api';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  cnic?: string | null;
  mobile?: string;
  gender?: string | null;
  religion?: string | null;
  district?: string | null;
  enrolledProgram?: string | null;
  academicYear?: string | null;
  universityId?: string | null;
  university?: { id: string; name: string; code: string };
  emailVerified?: boolean;
  profileComplete?: boolean;
}

interface RegisterStartResponse {
  pendingId: string;
  message: string;
  channels: { email: string; sms: string };
  demo: { emailOtp: string; smsOtp: string; emailVerifyUrl: string };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  registerStart: (data: object) => Promise<RegisterStartResponse>;
  registerVerify: (pendingId: string, method: 'email_otp' | 'sms_otp', code: string) => Promise<void>;
  completeEmailLink: (token: string) => Promise<void>;
  updateProfile: (data: object) => Promise<void>;
  changePassword: (data: object) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const u = await api<User>('/auth/me');
    setUser(u);
  }, []);

  useEffect(() => {
    if (getToken()) {
      refreshUser().catch(() => clearTokens()).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = async (username: string, password: string) => {
    const res = await api<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setTokens(res.accessToken, res.refreshToken);
    setUser(res.user);
  };

  const registerStart = async (data: object) => {
    return api<RegisterStartResponse>('/auth/register/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const registerVerify = async (pendingId: string, method: 'email_otp' | 'sms_otp', code: string) => {
    const res = await api<{ user: User; accessToken: string; refreshToken: string }>('/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify({ pendingId, method, code }),
    });
    setTokens(res.accessToken, res.refreshToken);
    setUser(res.user);
  };

  const completeEmailLink = async (token: string) => {
    const res = await api<{ user: User; accessToken: string; refreshToken: string }>(`/auth/register/confirm/${token}`);
    setTokens(res.accessToken, res.refreshToken);
    setUser(res.user);
  };

  const updateProfile = async (data: object) => {
    const u = await api<User>('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) });
    setUser(u);
  };

  const changePassword = async (data: object) => {
    await api('/auth/change-password', { method: 'POST', body: JSON.stringify(data) });
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, registerStart, registerVerify, completeEmailLink,
      updateProfile, changePassword, refreshUser, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
