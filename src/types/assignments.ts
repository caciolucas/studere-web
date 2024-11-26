export enum AssignmentType {
  EXAM = 'exam',
  PROJECT = 'project',
}

export interface AssignmentRequest {
  title: string;
  description: string;
  due_at: string; // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
  type: AssignmentType;
  course_id: string;
}

export interface AssignmentResponse {
  id: string;
  title: string;
  description: string;
  due_at: string; // ISO format
  type: AssignmentType;
  course_id: string;
  score: number;
  created_at: string;
}
