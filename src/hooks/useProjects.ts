import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Project } from '../db/database';

export function useProjects() {
  const projects = useLiveQuery(() => db.projects.toArray());

  const addProject = async (name: string) => {
    await db.projects.add({ name });
  };

  const updateProject = async (id: number, name: string) => {
    await db.projects.update(id, { name });
  };

  const deleteProject = async (id: number) => {
    await db.projects.delete(id);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject
  };
}