import {
  StatsContractRepository,
  type FinishedSessionRaw,
  type ModuleBasic,
  type StudentExportRaw,
  type StudentWithModulesRaw,
} from './stats-contract.repository';

export default class StatsMemoryRepository extends StatsContractRepository {
  private _activeStudentCount = 0;
  private _finishedSessions: FinishedSessionRaw[] = [];
  private _modules: ModuleBasic[] = [];
  private _studentsWithModules: StudentWithModulesRaw[] = [];
  private _studentsForExport: StudentExportRaw[] = [];
  private _resetCalled = false;

  reset(): void {
    this._activeStudentCount = 0;
    this._finishedSessions = [];
    this._modules = [];
    this._studentsWithModules = [];
    this._studentsForExport = [];
    this._resetCalled = false;
  }

  get resetCalled(): boolean {
    return this._resetCalled;
  }

  setActiveStudentCount(count: number): void {
    this._activeStudentCount = count;
  }

  setFinishedSessions(sessions: FinishedSessionRaw[]): void {
    this._finishedSessions = sessions;
  }

  setModules(modules: ModuleBasic[]): void {
    this._modules = modules;
  }

  setStudentsWithModules(students: StudentWithModulesRaw[]): void {
    this._studentsWithModules = students;
  }

  setStudentsForExport(students: StudentExportRaw[]): void {
    this._studentsForExport = students;
  }

  async countActiveStudents(): Promise<number> {
    return this._activeStudentCount;
  }

  async findFinishedSessions(): Promise<FinishedSessionRaw[]> {
    return this._finishedSessions;
  }

  async findModuleById(id: string): Promise<ModuleBasic | null> {
    return this._modules.find((m) => m.id === id) ?? null;
  }

  async findStudentsWithModuleDetails(): Promise<StudentWithModulesRaw[]> {
    return this._studentsWithModules;
  }

  async findModulesOrdered(): Promise<ModuleBasic[]> {
    return [...this._modules].sort((a, b) => a.order - b.order);
  }

  async findStudentsForExport(): Promise<StudentExportRaw[]> {
    return this._studentsForExport;
  }

  async resetGameData(): Promise<void> {
    this._resetCalled = true;
    this._finishedSessions = [];
    this._studentsWithModules = [];
    this._studentsForExport = [];
  }
}
