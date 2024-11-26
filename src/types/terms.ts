export interface TermRequest {
  name: string;
  start_date: string; // ISO date string (e.g., '2000-01-01')
  end_date: string;   // ISO date string
}

export interface TermResponse {
  id: string;
  name: string;
  user_id: string;
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
}
