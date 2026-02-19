import type { UserRole } from './constants';

export type Role = UserRole;

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  label: string;
  order: number;
  time_per_question: number;
  gradient: string;
  category_color: string;
  active: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct?: number;
  explanation?: string;
  category: string;
  context: string | null;
  order: number;
}

export interface GameSession {
  id: string;
  score: number;
  correct_answers: number;
  total_answered: number;
  streak: number;
  max_streak: number;
  nota: number | null;
  finished: boolean;
  is_best: boolean;
  user_id: string;
  module_id: string;
  created_at: string;
  finished_at: string | null;
}

export interface Answer {
  id: string;
  selected_option: number;
  is_correct: boolean;
  points: number;
  time_spent: number;
  session_id: string;
  question_id: string;
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  correct_option: number;
  explanation: string;
  points: number;
  streak: number;
  score: number;
}

export interface RankingEntry {
  user_id: string;
  name: string;
  average_nota: number;
  modules_completed: number;
  total_score: number;
  best_streak: number;
  module_notas?: { module_id: string; nota: number }[];
}

export interface Stats {
  total_students: number;
  total_sessions: number;
  average_nota: number;
  approval_rate: number;
  hardest_module: {
    id: string;
    title: string;
    average_nota: number;
  } | null;
}

export interface StudentDetail {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  average_nota: number;
  modules_completed: number;
  modules: {
    module_id: string;
    module_title: string;
    nota: number;
    score: number;
    correct_answers: number;
    total_answered: number;
    finished_at: string | null;
  }[];
}
