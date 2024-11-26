import apiClient from './axios';
import { CourseRequest, CourseResponse } from '../types/courses';

// Fetch all courses
export const fetchCourses = async (): Promise<CourseResponse[]> => {
  const response = await apiClient.get<CourseResponse[]>('/courses');
  return response.data;
};

// Create a new course
export const createCourse = async (data: CourseRequest): Promise<CourseResponse> => {
  const response = await apiClient.post<CourseResponse>('/courses', data);
  return response.data;
};

// Update an existing course
export const updateCourse = async (
  id: string,
  data: CourseRequest
): Promise<CourseResponse> => {
  const response = await apiClient.put<CourseResponse>(`/courses/${id}`, data);
  return response.data;
};

// Delete a course
export const deleteCourse = async (id: string): Promise<void> => {
  await apiClient.delete(`/courses/${id}`);
};
