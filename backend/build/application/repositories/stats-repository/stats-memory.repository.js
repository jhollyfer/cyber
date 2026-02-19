import {
  StatsContractRepository
} from "../../../chunk-HPJBMAPB.js";
import {
  __name
} from "../../../chunk-SHUYVCID.js";

// application/repositories/stats-repository/stats-memory.repository.ts
var StatsMemoryRepository = class extends StatsContractRepository {
  static {
    __name(this, "StatsMemoryRepository");
  }
  _activeStudentCount = 0;
  _finishedSessions = [];
  _modules = [];
  _studentsWithModules = [];
  _studentsForExport = [];
  _resetCalled = false;
  reset() {
    this._activeStudentCount = 0;
    this._finishedSessions = [];
    this._modules = [];
    this._studentsWithModules = [];
    this._studentsForExport = [];
    this._resetCalled = false;
  }
  get resetCalled() {
    return this._resetCalled;
  }
  setActiveStudentCount(count) {
    this._activeStudentCount = count;
  }
  setFinishedSessions(sessions) {
    this._finishedSessions = sessions;
  }
  setModules(modules) {
    this._modules = modules;
  }
  setStudentsWithModules(students) {
    this._studentsWithModules = students;
  }
  setStudentsForExport(students) {
    this._studentsForExport = students;
  }
  async countActiveStudents() {
    return this._activeStudentCount;
  }
  async findFinishedSessions() {
    return this._finishedSessions;
  }
  async findModuleById(id) {
    return this._modules.find((m) => m.id === id) ?? null;
  }
  async findStudentsWithModuleDetails() {
    return this._studentsWithModules;
  }
  async findModulesOrdered() {
    return [
      ...this._modules
    ].sort((a, b) => a.order - b.order);
  }
  async findStudentsForExport() {
    return this._studentsForExport;
  }
  async resetGameData() {
    this._resetCalled = true;
    this._finishedSessions = [];
    this._studentsWithModules = [];
    this._studentsForExport = [];
  }
};
export {
  StatsMemoryRepository as default
};
