export interface StudyPlanRequest {
  prompt: string;
  course_id: string;
}

export interface StudyPlanManualRequest {
  title: string;      
  description: string;
  course_id: string;     
  topics: StudyPlanTopic[];
}

export interface StudyPlanTopic {
  id: string;
  title: string;
  description: string;
  completed_at: string | null;
  created_at: string;
}

export interface StudyPlanResponse {
  id: string;
  title: string;
  course_id: string;
  topics: StudyPlanTopic[];
  created_at: string;
}
