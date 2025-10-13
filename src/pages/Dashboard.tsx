import {
  Plus,
  FolderKanban,
  CheckCircle2,
  Archive,
  TrendingUp,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const { projects, loading, error } = useProjects();
  const { t } = useTranslation();

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: 0,
    archived: projects.filter((p) => p.status === "archived").length,
  };

  const handleNewProject = () => {
    // TODO: Implementare creazione progetto
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">
              {t("common.error")}
            </CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <Button
          onClick={handleNewProject}
          size="lg"
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-5 w-5" />
          {t("dashboard.newProject")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.total")}
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("dashboard.stats.totalDescription")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.active")}
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("dashboard.stats.activeDescription")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-green-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.completed")}
            </CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("dashboard.stats.completedDescription")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-muted-foreground/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.archived")}
            </CardTitle>
            <div className="p-2 rounded-lg bg-muted">
              <Archive className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.archived}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("dashboard.stats.archivedDescription")}
            </p>
          </CardContent>
        </Card>
      </div>

      {stats.total === 0 && (
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center space-y-4 py-12">
            <div className="mx-auto p-4 rounded-full bg-primary/10 w-fit">
              <FolderKanban className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {t("dashboard.emptyState.title")}
              </CardTitle>
              <CardDescription className="text-base max-w-md mx-auto">
                {t("dashboard.emptyState.description")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center pb-12">
            <Button onClick={handleNewProject} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              {t("dashboard.emptyState.action")}
            </Button>
          </CardContent>
        </Card>
      )}

      {stats.total > 0 && (
        <div className="grid gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">
                {t("dashboard.recentProjects.title")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.recentProjects.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{project.name}</p>
                      {project.description && (
                        <p className="text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "active"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t(`dashboard.status.${project.status}`)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
