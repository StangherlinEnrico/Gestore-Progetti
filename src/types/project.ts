export type ProjectStatus = "active" | "completed" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
  startDate: string;
  status: ProjectStatus;
}
