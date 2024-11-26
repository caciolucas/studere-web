import apiClient from './axios';
import { AssignmentRequest, AssignmentResponse } from '../types/assignments';

// Fetch all assignments
export const fetchAssignments = async (): Promise<AssignmentResponse[]> => {
  const response = await apiClient.get<AssignmentResponse[]>('/assignments');
  return response.data;
};

// Create a new assignment
export const createAssignment = async (
  data: AssignmentRequest
): Promise<AssignmentResponse> => {
  const response = await apiClient.post<AssignmentResponse>('/assignments', data);
  return response.data;
};

// Update an existing assignment
export const updateAssignment = async (
  id: string,
  data: AssignmentRequest
): Promise<AssignmentResponse> => {
  const response = await apiClient.put<AssignmentResponse>(`/assignments/${id}`, data);
  return response.data;
};

// Delete an assignment
export const deleteAssignment = async (id: string): Promise<void> => {
  await apiClient.delete(`/assignments/${id}`);
};
