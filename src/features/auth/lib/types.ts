export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  // Другие поля по необходимости
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
