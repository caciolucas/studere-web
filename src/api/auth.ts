import { LoginRequest, LoginResponse } from '../types/auth';
import apiClient from './axios';


export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/users/login/', data);
  return response.data;
};


export const register = async (email: string, password: string) => {
  const response = await apiClient.post('/users/register', { email, password });
  return response.data;
};