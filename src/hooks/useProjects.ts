import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Project, ProjectFormData } from '../types/project';

export function useProjects() {
  const projects = useLiveQuery(() => db.projects.toArray());

  const addProject = async (data: ProjectFormData) => {
    const now = new Date().toISOString();
    const project: Project = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now
    };
    await db.projects.add(project);
  };

  const updateProject = async (id: string, data: Partial<ProjectFormData>) => {
    await db.projects.update(id, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteProject = async (id: string) => {
    await db.projects.delete(id);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject
  };
}