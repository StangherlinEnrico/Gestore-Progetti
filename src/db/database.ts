import Dexie, { type EntityTable } from 'dexie';
import type { Project } from '../types/project';

const db = new Dexie('GestoreProgettiDB') as Dexie & {
  projects: EntityTable<Project, 'id'>;
};

db.version(1).stores({
  projects: 'id, name, status, startDate, createdAt, updatedAt'
});

export { db };