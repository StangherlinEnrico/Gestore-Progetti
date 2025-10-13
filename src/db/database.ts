import type {
  Settings,
  Project,
  CreateProjectPayload,
  UpdateProjectPayload
} from '../types/database';

export type {
  Settings,
  Project,
  CreateProjectPayload,
  UpdateProjectPayload
};

const DEBUG = import.meta.env.DEV;

export class Database {
  constructor() {
    if (DEBUG) console.log('[Database] constructor: initializing');
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    if (DEBUG) console.log('[Database] initializeDefaults: checking storage');
    
    if (!localStorage.getItem('app_settings')) {
      if (DEBUG) console.log('[Database] initializeDefaults: setting default settings');
      const defaultSettings: Settings = {
        theme: 'system',
        language: 'it'
      };
      localStorage.setItem('app_settings', JSON.stringify(defaultSettings));
    }

    if (!localStorage.getItem('app_projects')) {
      if (DEBUG) console.log('[Database] initializeDefaults: setting empty projects array');
      localStorage.setItem('app_projects', JSON.stringify([]));
    }
  }

  async getSettings(): Promise<Settings> {
    if (DEBUG) console.log('[Database] getSettings: reading from storage');
    const data = localStorage.getItem('app_settings');
    const settings = data ? JSON.parse(data) : null;
    if (DEBUG) console.log('[Database] getSettings: data', settings);
    return settings;
  }

  async updateSettings(payload: Partial<Settings>): Promise<void> {
    if (DEBUG) console.log('[Database] updateSettings: payload', payload);
    const current = await this.getSettings();
    const updated = { ...current, ...payload };
    localStorage.setItem('app_settings', JSON.stringify(updated));
    if (DEBUG) console.log('[Database] updateSettings: saved', updated);
  }

  async getProjectById(projectId: string): Promise<Project | null> {
    if (DEBUG) console.log('[Database] getProjectById:', projectId);
    const projects = await this.getAllProjects();
    const project = projects.find(p => p.id === projectId) || null;
    if (DEBUG) console.log('[Database] getProjectById: found', project);
    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    if (DEBUG) console.log('[Database] getAllProjects: reading from storage');
    const data = localStorage.getItem('app_projects');
    const projects = data ? JSON.parse(data) : [];
    if (DEBUG) console.log('[Database] getAllProjects: count', projects.length);
    return projects;
  }

  async createProject(payload: CreateProjectPayload): Promise<Project> {
    if (DEBUG) console.log('[Database] createProject: payload', payload);
    const projects = await this.getAllProjects();
    const now = new Date();
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: payload.name,
      description: payload.description || null,
      createdAt: now,
      updatedAt: now,
      status: 'active'
    };
    projects.push(newProject);
    localStorage.setItem('app_projects', JSON.stringify(projects));
    if (DEBUG) console.log('[Database] createProject: created', newProject);
    return newProject;
  }

  async updateProject(projectId: string, payload: UpdateProjectPayload): Promise<Project> {
    if (DEBUG) console.log('[Database] updateProject:', projectId, payload);
    const projects = await this.getAllProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index === -1) {
      throw new Error('Project not found');
    }
    const updatedProject = {
      ...projects[index],
      ...payload,
      updatedAt: new Date()
    };
    projects[index] = updatedProject;
    localStorage.setItem('app_projects', JSON.stringify(projects));
    if (DEBUG) console.log('[Database] updateProject: updated', updatedProject);
    return updatedProject;
  }

  async deleteProject(projectId: string): Promise<void> {
    if (DEBUG) console.log('[Database] deleteProject:', projectId);
    const projects = await this.getAllProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem('app_projects', JSON.stringify(filtered));
    if (DEBUG) console.log('[Database] deleteProject: deleted, remaining', filtered.length);
  }

  async archiveProject(projectId: string): Promise<void> {
    if (DEBUG) console.log('[Database] archiveProject:', projectId);
    await this.updateProject(projectId, { status: 'archived' });
  }
}

export const db = new Database();