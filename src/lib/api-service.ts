/**
 * API Service - Handles all communication with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Token management
const TOKEN_KEY = 'coffee_guardian_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error('Network error:', error);
    throw new Error('Unable to connect to the server. Please check your internet connection.');
  }
  
  // Handle empty responses
  const text = await response.text();
  let data: any;
  
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON response:', text);
      throw new Error('Server returned an invalid response. Please try again later.');
    }
  } else {
    // Empty response
    if (!response.ok) {
      throw new Error(`Server error (${response.status}). Please try again later.`);
    }
    data = {};
  }
  
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  
  return data;
}

// ============ AUTH API ============

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  language: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  signup: async (email: string, password: string, fullName?: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    setToken(response.token);
    return response;
  },
  
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(response.token);
    return response;
  },
  
  logout: async (): Promise<void> => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },
  
  getCurrentUser: async (): Promise<{ user: User }> => {
    return apiRequest<{ user: User }>('/api/auth/me');
  },
};

// ============ USER API ============

export interface UserSettings {
  language: string;
  notifications_enabled: boolean;
  dark_mode: boolean;
}

export const userApi = {
  updateProfile: async (data: { full_name?: string; avatar_url?: string }): Promise<User> => {
    return apiRequest<User>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  getSettings: async (): Promise<UserSettings> => {
    return apiRequest<UserSettings>('/api/users/settings');
  },
  
  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    return apiRequest<UserSettings>('/api/users/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// ============ DIAGNOSIS API ============

export interface Diagnosis {
  id: number;
  user_id: number;
  image_url: string | null;
  disease_name: string;
  confidence: number;
  severity: string | null;
  treatment_data: string | null;
  notes: string | null;
  created_at: string;
}

export interface SaveDiagnosisData {
  image_url?: string;
  disease_name: string;
  confidence: number;
  severity?: string;
  treatment_data?: string;
  notes?: string;
}

export const diagnosisApi = {
  save: async (data: SaveDiagnosisData): Promise<Diagnosis> => {
    return apiRequest<Diagnosis>('/api/diagnosis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getHistory: async (): Promise<Diagnosis[]> => {
    return apiRequest<Diagnosis[]>('/api/diagnosis');
  },
  
  getById: async (id: number): Promise<Diagnosis> => {
    return apiRequest<Diagnosis>(`/api/diagnosis/${id}`);
  },
  
  delete: async (id: number): Promise<void> => {
    await apiRequest(`/api/diagnosis/${id}`, { method: 'DELETE' });
  },
};

// ============ HEALTH CHECK ============

export const healthCheck = async (): Promise<{ status: string }> => {
  return apiRequest<{ status: string }>('/api/health');
};
