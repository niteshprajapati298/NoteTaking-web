// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignUpData {
  name: string;
  email: string;
  dateOfBirth: string;
  otp: string;
}
