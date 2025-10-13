export type Settings = {
  theme: 'light' | 'dark' | 'system';
  language: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed' | 'archived' | 'deleted';
};

export type CreateProjectPayload = {
  name: string;
  description?: string;
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string;
  status?: Project['status'];
};