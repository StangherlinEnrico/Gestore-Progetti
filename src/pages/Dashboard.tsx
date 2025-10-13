import { Plus, FolderKanban, CheckCircle2, Archive } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const { projects } = useProjects();

  const stats = {
    total: projects?.length || 0,
    active: projects?.filter((p) => p.status === "active").length || 0,
    completed: projects?.filter((p) => p.status === "completed").length || 0,
    archived: projects?.filter((p) => p.status === "archived").length || 0,
  };

  const handleNewProject = () => {
    // Navigate to project creation form
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Panoramica dei tuoi progetti</p>
        </div>
        <Button onClick={handleNewProject} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nuovo progetto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Totale progetti
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attivi</CardTitle>
            <div className="h-4 w-4 rounded-full bg-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completati</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archiviati</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archived}</div>
          </CardContent>
        </Card>
      </div>

      {stats.total === 0 && (
        <Card className="gradient-mesh">
          <CardHeader>
            <CardTitle>Nessun progetto ancora</CardTitle>
            <CardDescription>
              Inizia creando il tuo primo progetto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleNewProject}>
              <Plus className="mr-2 h-4 w-4" />
              Crea il primo progetto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
