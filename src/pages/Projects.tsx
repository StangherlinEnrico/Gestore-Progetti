import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ProjectDialog } from "../components/projects/ProjectDialog";
import { ProjectCard } from "../components/projects/ProjectCard";
import { db } from "../db/database";
import type { Project } from "../db/database";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed" | "archived"
  >("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const projectsData = await db.getAllProjects();
    setProjects(projectsData);
  };

  const handleCreateProject = async (data: {
    name: string;
    description?: string;
    status: "active" | "completed" | "archived";
  }) => {
    await db.createProject({
      name: data.name,
      description: data.description,
    });
    await loadProjects();
    setDialogOpen(false);
  };

  const handleEditProject = async (data: {
    name: string;
    description?: string;
    status: "active" | "completed" | "archived";
  }) => {
    if (editingProject) {
      await db.updateProject(editingProject.id, {
        name: data.name,
        description: data.description,
        status: data.status,
      });
      await loadProjects();
      setEditingProject(undefined);
      setDialogOpen(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo progetto?")) {
      await db.deleteProject(id);
      await loadProjects();
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Progetti</h2>
          <p className="text-muted-foreground">
            Gestisci tutti i tuoi progetti
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProject(undefined);
            setDialogOpen(true);
          }}
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuovo progetto
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cerca progetti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(
              value as "all" | "active" | "completed" | "archived"
            )
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtra per stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti</SelectItem>
            <SelectItem value="active">Attivi</SelectItem>
            <SelectItem value="completed">Completati</SelectItem>
            <SelectItem value="archived">Archiviati</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={(p) => {
                setEditingProject(p);
                setDialogOpen(true);
              }}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-lg font-medium">Nessun progetto trovato</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Prova a modificare i filtri di ricerca"
                : "Inizia creando un nuovo progetto"}
            </p>
          </div>
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
        onSubmit={editingProject ? handleEditProject : handleCreateProject}
      />
    </div>
  );
}
