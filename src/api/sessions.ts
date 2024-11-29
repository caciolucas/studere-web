import apiClient from './axios';
import { StudySessionRequest, StudySessionResponse, StudySessionUpdateRequest } from '../types/sessions';

// Start a study session
export const startSession = async (data: StudySessionRequest): Promise<StudySessionResponse> => {
  const response = await apiClient.post<StudySessionResponse>('/sessions/start', data);
  return response.data;
};

// Get the current active session
export const getCurrentSession = async (plan_id: string): Promise<StudySessionResponse> => {
  const response = await apiClient.get<StudySessionResponse>(`/sessions/current/${plan_id}`);
  return response.data;
};

// End a session
export const endSession = async (plan_id: string): Promise<StudySessionResponse> => {
  const response = await apiClient.post<StudySessionResponse>(`/sessions/end/${plan_id}`);
  return response.data;
};

// Pause a session
export const pauseSession = async (plan_id: string): Promise<StudySessionResponse> => {
  const response = await apiClient.post<StudySessionResponse>(`/sessions/pause/${plan_id}`);
  return response.data;
};

// Unpause a session
export const unpauseSession = async (plan_id: string): Promise<StudySessionResponse> => {
  const response = await apiClient.post<StudySessionResponse>(`/sessions/unpause/${plan_id}`);
  return response.data;
};

export const fetchSessionHistory = async (plan_id: string): Promise<StudySessionResponse[]> => {
  const response = await apiClient.get<StudySessionResponse[]>(`/sessions/history/${plan_id}`);
  return response.data;
}

export const updateSession = async (
  plan_id: string,
  data: StudySessionUpdateRequest
): Promise<StudySessionResponse> => {
  const response = await apiClient.patch<StudySessionResponse>(`/sessions/by-plan/${plan_id}`, data);
  return response.data;
};