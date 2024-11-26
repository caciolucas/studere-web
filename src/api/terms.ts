import apiClient from './axios';
import { TermRequest, TermResponse } from '../types/terms';

// Fetch all terms
export const fetchTerms = async (): Promise<TermResponse[]> => {
  const response = await apiClient.get<TermResponse[]>('/terms');
  return response.data;
};

// Create a new term
export const createTerm = async (data: TermRequest): Promise<TermResponse> => {
  const response = await apiClient.post<TermResponse>('/terms', data);
  return response.data;
};


export const deleteTerm = async (id: string): Promise<void> => {
  await apiClient.delete(`/terms/${id}`);
};

export const updateTerm = async (
  id: string,
  data: TermRequest
): Promise<TermResponse> => {
  const response = await apiClient.put<TermResponse>(`/terms/${id}`, data);
  return response.data;
};
