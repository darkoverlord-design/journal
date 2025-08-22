export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: number;
  prompt: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
}