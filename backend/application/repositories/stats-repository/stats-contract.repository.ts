export interface FinishedSessionRaw {
  nota: number | null;
  module_id: string;
}

export interface StudentWithModulesRaw {
  id: string;
  name: string;
  phone: string;
  created_at: Date;
  game_sessions: {
    nota: number | null;
    score: number;
    module_id: string;
    module_title: string;
    correct_answers: number;
    total_answered: number;
    finished_at: Date | null;
  }[];
}

export interface ModuleBasic {
  id: string;
  title: string;
  order: number;
}

export interface StudentExportRaw {
  id: string;
  name: string;
  phone: string;
  created_at: Date;
  game_sessions: {
    nota: number | null;
    score: number;
    module_id: string;
    correct_answers: number;
    total_answered: number;
    max_streak: number;
    finished_at: Date | null;
  }[];
}

export abstract class StatsContractRepository {
  abstract countActiveStudents(): Promise<number>;
  abstract findFinishedSessions(): Promise<FinishedSessionRaw[]>;
  abstract findModuleById(id: string): Promise<ModuleBasic | null>;
  abstract findStudentsWithModuleDetails(): Promise<StudentWithModulesRaw[]>;
  abstract findModulesOrdered(): Promise<ModuleBasic[]>;
  abstract findStudentsForExport(): Promise<StudentExportRaw[]>;
  abstract resetGameData(): Promise<void>;
}
