// ---------------------------------------------------------------------------
// Role — mirrors Prisma Role enum (generated/prisma/enums.ts uses @ts-nocheck)
// ---------------------------------------------------------------------------

export const ERole = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  STUDENT: 'STUDENT',
} as const;

export type ERole = (typeof ERole)[keyof typeof ERole];

// ---------------------------------------------------------------------------
// Utility types
// ---------------------------------------------------------------------------

/** Makes selected keys of T optional while keeping the rest required. */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ---------------------------------------------------------------------------
// Base entity
// ---------------------------------------------------------------------------

export interface Base {
  id: string;
  created_at: Date;
  updated_at: Date;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface Meta {
  total: number;
  page: number;
  per_page: number;
  last_page: number;
}

export interface Paginated<T> {
  data: T[];
  meta: Meta;
}

// ---------------------------------------------------------------------------
// Domain entities
// ---------------------------------------------------------------------------

export interface IUser extends Base {
  name: string;
  phone: string;
  password: string;
  role: ERole;
  active: boolean;
}

export interface IModule extends Base {
  title: string;
  description: string;
  icon: string;
  label: string;
  order: number;
  time_per_question: number | null;
  gradient: string;
  category_color: string;
  active: boolean;
  deleted_at: Date | null;
}

export interface IQuestion extends Base {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  context: string | null;
  order: number;
  active: boolean;
  deleted_at: Date | null;
  module_id: string;
}

export interface IGameSession extends Base {
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
  finished_at: Date | null;
}

export interface IAnswer {
  id: string;
  selected_option: number;
  is_correct: boolean;
  points: number;
  time_spent: number;
  session_id: string;
  question_id: string;
  created_at: Date;
}

export interface JWTPayload {
  sub: string;
  phone: string;
  role: ERole;
  type: 'access';
}
