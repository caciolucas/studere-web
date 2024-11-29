export interface StudySessionRequest {
  title: string;
  description: string;
  plan_id: string;
}

export interface StudySessionResponse {
  id: string;
  title: string;
  description: string;
  notes: string | null;
  topics: string[];
  plan: {
    id: string;
    title: string;
  };
  last_pause_time: string | null;
  started_at: string;
  ended_at: string | null;
  total_pause_time: number;
  status: 'active' | 'paused' | 'completed';
}


export interface StudySessionUpdateRequest {
  notes: string;
  topics: string[]; // Array of UUIDs
}
