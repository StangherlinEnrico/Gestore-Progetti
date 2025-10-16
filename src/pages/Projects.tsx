import { useState, useEffect } from "react";
import { Plus, Search, Grid3x3, List } from "lucide-react";
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
import { db } from "../db/database";
import type { Project } from "../db/database";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, FolderOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed" | "archived"
  >("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

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

  const handleCardClick = (project: Project) => {
    console.log("TODO: apertura dettagli progetto", project);
    // TODO: implementare navigazione a pagina dettaglio progetto
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Attivo";
      case "completed":
        return "Completato";
      case "archived":
        return "Archiviato";
      default:
        return status;
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
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
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <>
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                  onClick={() => handleCardClick(project)}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <FolderOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {project.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.createdAt).toLocaleDateString(
                              "it-IT"
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description ||
                        "Nessuna descrizione disponibile per questo progetto"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Nome</TableHead>
                    <TableHead>Descrizione</TableHead>
                    <TableHead className="w-[150px]">Stato</TableHead>
                    <TableHead className="w-[150px]">Data creazione</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="cursor-pointer"
                      onClick={() => handleCardClick(project)}
                    >
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>
                        {project.description || "Nessuna descrizione"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(project.createdAt).toLocaleDateString(
                          "it-IT"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
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
