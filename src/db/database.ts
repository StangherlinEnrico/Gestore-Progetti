import type {
  UserPreferences,
  UserSecurity,
  UserSubscription,
  SettingsPageData,
  UpdateSettingsPayload,
  Project,
  CreateProjectPayload,
  UpdateProjectPayload
} from '../types/database';

export type {
  UserPreferences,
  UserSecurity,
  UserSubscription,
  SettingsPageData,
  UpdateSettingsPayload,
  Project,
  CreateProjectPayload,
  UpdateProjectPayload
};

const DEBUG = import.meta.env.DEV;
const STORAGE_KEYS = {
  PREFERENCES: 'app_preferences',
  SECURITY: 'app_security',
  SUBSCRIPTION: 'app_subscription',
  PROJECTS: 'app_projects'
};

export class Database {
  private readonly SINGLE_USER_ID = 'default-user';

  constructor() {
    if (DEBUG) console.log('[Database] constructor: initializing');
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    if (DEBUG) console.log('[Database] initializeDefaults: checking storage');
    
    if (!localStorage.getItem(STORAGE_KEYS.PREFERENCES)) {
      if (DEBUG) console.log('[Database] initializeDefaults: setting default preferences');
      const defaultPreferences: UserPreferences = {
        theme: 'system',
        language: 'it',
        timezone: 'Europe/Rome',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(defaultPreferences));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SECURITY)) {
      if (DEBUG) console.log('[Database] initializeDefaults: setting default security');
      const defaultSecurity: UserSecurity = {
        twoFactorEnabled: false,
        lastPasswordChange: null,
        activeSessions: 1
      };
      localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(defaultSecurity));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION)) {
      if (DEBUG) console.log('[Database] initializeDefaults: setting default subscription');
      const defaultSubscription: UserSubscription = {
        plan: 'free',
        status: 'active',
        expiresAt: null,
        autoRenew: false
      };
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(defaultSubscription));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      if (DEBUG) console.log('[Database] initializeDefaults: setting empty projects array');
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
    }
  }

  // Settings Management

  async getSettingsData(): Promise<SettingsPageData> {
    if (DEBUG) console.log('[Database] getSettingsData: fetching all settings');
    const preferences = await this.getUserPreferences();
    const security = await this.getUserSecurity();
    const subscription = await this.getUserSubscription();

    const data = {
      preferences,
      security,
      subscription
    };
    if (DEBUG) console.log('[Database] getSettingsData: data retrieved', data);
    return data;
  }

  async updateSettings(payload: UpdateSettingsPayload): Promise<void> {
    if (DEBUG) console.log('[Database] updateSettings: payload', payload);
    if (payload.preferences) {
      await this.updatePreferences(payload.preferences);
    }
    if (payload.security) {
      await this.updateSecurity(payload.security);
    }
    if (DEBUG) console.log('[Database] updateSettings: complete');
  }

  private async getUserPreferences(): Promise<UserPreferences> {
    if (DEBUG) console.log('[Database] getUserPreferences: reading from storage');
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    const preferences = data ? JSON.parse(data) : null;
    if (DEBUG) console.log('[Database] getUserPreferences: data', preferences);
    return preferences;
  }

  private async getUserSecurity(): Promise<UserSecurity> {
    if (DEBUG) console.log('[Database] getUserSecurity: reading from storage');
    const data = localStorage.getItem(STORAGE_KEYS.SECURITY);
    const security = data ? JSON.parse(data) : null;
    if (DEBUG) console.log('[Database] getUserSecurity: data', security);
    return security;
  }

  private async getUserSubscription(): Promise<UserSubscription> {
    if (DEBUG) console.log('[Database] getUserSubscription: reading from storage');
    const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    const subscription = data ? JSON.parse(data) : null;
    if (DEBUG) console.log('[Database] getUserSubscription: data', subscription);
    return subscription;
  }

  private async updatePreferences(data: Partial<UserPreferences>): Promise<void> {
    if (DEBUG) console.log('[Database] updatePreferences: updating', data);
    const current = await this.getUserPreferences();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    if (DEBUG) console.log('[Database] updatePreferences: saved', updated);
  }

  private async updateSecurity(data: UpdateSettingsPayload['security']): Promise<void> {
    if (DEBUG) console.log('[Database] updateSecurity: updating', data);
    const current = await this.getUserSecurity();
    const updated = { ...current, ...data };
    if (data?.password) {
      updated.lastPasswordChange = new Date();
    }
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(updated));
    if (DEBUG) console.log('[Database] updateSecurity: saved', updated);
  }

  // Project Management

  async getProjectById(projectId: string): Promise<Project | null> {
    if (DEBUG) console.log('[Database] getProjectById:', projectId);
    const projects = await this.getAllProjects();
    const project = projects.find(p => p.id === projectId) || null;
    if (DEBUG) console.log('[Database] getProjectById: found', project);
    return project;
  }

  async getAllProjects(): Promise<Project[]> {
    if (DEBUG) console.log('[Database] getAllProjects: reading from storage');
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const projects = data ? JSON.parse(data) : [];
    if (DEBUG) console.log('[Database] getAllProjects: count', projects.length);
    return projects;
  }

  async createProject(payload: Omit<CreateProjectPayload, 'ownerId'>): Promise<Project> {
    if (DEBUG) console.log('[Database] createProject: payload', payload);
    const projects = await this.getAllProjects();
    const now = new Date();
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: payload.name,
      description: payload.description || null,
      ownerId: this.SINGLE_USER_ID,
      createdAt: now,
      updatedAt: now,
      status: 'active'
    };
    projects.push(newProject);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
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
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    if (DEBUG) console.log('[Database] updateProject: updated', updatedProject);
    return updatedProject;
  }

  async deleteProject(projectId: string): Promise<void> {
    if (DEBUG) console.log('[Database] deleteProject:', projectId);
    const projects = await this.getAllProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    if (DEBUG) console.log('[Database] deleteProject: deleted, remaining', filtered.length);
  }

  async archiveProject(projectId: string): Promise<void> {
    if (DEBUG) console.log('[Database] archiveProject:', projectId);
    await this.updateProject(projectId, { status: 'archived' });
  }
}

export const db = new Database();