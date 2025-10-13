import { useState, useEffect, useCallback } from 'react';
import { db, type Project, type CreateProjectPayload, type UpdateProjectPayload } from '../db/database';

const DEBUG = import.meta.env.DEV;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    if (DEBUG) console.log('[useProjects] fetchProjects: start');
    try {
      setLoading(true);
      setError(null);
      if (DEBUG) console.log('[useProjects] fetchProjects: calling db.getAllProjects()');
      const data = await db.getAllProjects();
      if (DEBUG) console.log('[useProjects] fetchProjects: data received', data);
      setProjects(data);
    } catch (err) {
      if (DEBUG) console.error('[useProjects] fetchProjects: error', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
    } finally {
      setLoading(false);
      if (DEBUG) console.log('[useProjects] fetchProjects: complete');
    }
  }, []);

  useEffect(() => {
    if (DEBUG) console.log('[useProjects] useEffect: mounting, fetching projects');
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(async (payload: Omit<CreateProjectPayload, 'ownerId'>) => {
    if (DEBUG) console.log('[useProjects] createProject:', payload);
    try {
      if (DEBUG) console.log('[useProjects] createProject: calling db.createProject()');
      const newProject = await db.createProject(payload);
      if (DEBUG) console.log('[useProjects] createProject: project created', newProject);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      if (DEBUG) console.error('[useProjects] createProject: error', err);
      throw err instanceof Error ? err : new Error('Failed to create project');
    }
  }, []);

  const updateProject = useCallback(async (projectId: string, payload: UpdateProjectPayload) => {
    if (DEBUG) console.log('[useProjects] updateProject:', projectId, payload);
    try {
      if (DEBUG) console.log('[useProjects] updateProject: calling db.updateProject()');
      const updatedProject = await db.updateProject(projectId, payload);
      if (DEBUG) console.log('[useProjects] updateProject: project updated', updatedProject);
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      if (DEBUG) console.error('[useProjects] updateProject: error', err);
      throw err instanceof Error ? err : new Error('Failed to update project');
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    if (DEBUG) console.log('[useProjects] deleteProject:', projectId);
    try {
      if (DEBUG) console.log('[useProjects] deleteProject: calling db.deleteProject()');
      await db.deleteProject(projectId);
      if (DEBUG) console.log('[useProjects] deleteProject: project deleted');
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      if (DEBUG) console.error('[useProjects] deleteProject: error', err);
      throw err instanceof Error ? err : new Error('Failed to delete project');
    }
  }, []);

  const archiveProject = useCallback(async (projectId: string) => {
    if (DEBUG) console.log('[useProjects] archiveProject:', projectId);
    try {
      if (DEBUG) console.log('[useProjects] archiveProject: calling db.archiveProject()');
      await db.archiveProject(projectId);
      if (DEBUG) console.log('[useProjects] archiveProject: project archived');
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, status: 'archived' as const } : p
      ));
    } catch (err) {
      if (DEBUG) console.error('[useProjects] archiveProject: error', err);
      throw err instanceof Error ? err : new Error('Failed to archive project');
    }
  }, []);

  const refetch = useCallback(() => {
    if (DEBUG) console.log('[useProjects] refetch: manual refetch triggered');
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    refetch
  };
}