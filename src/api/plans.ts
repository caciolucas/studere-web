import apiClient from './axios';
import { StudyPlanManualRequest, StudyPlanRequest, StudyPlanResponse } from '../types/plans';

// Fetch all study plans
export const fetchStudyPlans = async (): Promise<StudyPlanResponse[]> => {
  const response = await apiClient.get<StudyPlanResponse[]>('/plans/');
  return response.data;
};

// Create a new study plan manually with custom fields (title, description, topics)
export const createStudyPlan = async (data: StudyPlanManualRequest): Promise<StudyPlanResponse> => {
  const response = await apiClient.post<StudyPlanResponse>('/plans/', data);
  return response.data;
};

// Create a new study plan using AI generation
export const createStudyPlanWithAI = async (data: StudyPlanRequest): Promise<StudyPlanResponse> => {
  const response = await apiClient.post<StudyPlanResponse>('/plans/ai-generate/', data);
  return response.data;
};

// Delete a study plan
export const deleteStudyPlan = async (id: string): Promise<void> => {
  await apiClient.delete(`/plans/${id}/`);
};
