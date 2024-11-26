import apiClient from './axios';
import { StreakResponse, StudyTimeResponse } from '../types/dashboard';

// Fetch study time by coursek
export const fetchStudyTimeByCourse = async (): Promise<StudyTimeResponse[]> => {
  const response = await apiClient.get<StudyTimeResponse[]>('/dashboard/study_time_by_course/');
  return response.data;
};

export const fetchStreaks = async (): Promise<StreakResponse> => {
  const response = await apiClient.get<StreakResponse>('/dashboard/streaks/');
  return response.data;
};