import type { IQuestion } from '@application/core/entities';

export type QuestionCreatePayload = Omit<IQuestion, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

export type QuestionUpdatePayload = Partial<Omit<IQuestion, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'module_id'>> & {
  id: string;
};

export abstract class QuestionContractRepository {
  abstract create(payload: QuestionCreatePayload): Promise<IQuestion>;
  abstract update(payload: QuestionUpdatePayload): Promise<IQuestion>;
  abstract findById(id: string): Promise<IQuestion | null>;
  abstract findByModuleId(moduleId: string, activeOnly?: boolean): Promise<IQuestion[]>;
  abstract delete(id: string): Promise<IQuestion>;
}
