import {
  FolderKanban,
  CheckCircle2,
  Archive,
  TrendingUp,
  Grid3x3,
  List,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";

export default function Dashboard() {
  const { projects, loading, error } = useProjects();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [displayCount, setDisplayCount] = useState(9);

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    archived: projects.filter((p) => p.status === "archived").length,
  };

  const handleNewProject = () => {
    navigate("/projects?action=create");
  };

  const handleProjectClick = (projectId: string) => {
    // TODO: Implementare navigazione al dettaglio progetto
    console.log("TODO: Navigare al progetto con ID:", projectId);
  };

  const handleStatClick = (status: string) => {
    // TODO: Implementare navigazione alla pagina progetti con filtro
    console.log("TODO: Navigare a /projects con filtro status:", status);
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace > 0) {
      return truncated.substring(0, lastSpace) + "...";
    }

    return truncated + "...";
  };

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const displayedProjects = sortedProjects.slice(0, displayCount);
  const hasMoreProjects = sortedProjects.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 3);
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-8">
        <div className="space-y-1">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-16 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
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
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("dashboard.title")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("dashboard.subtitle")}
        </p>
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

        <Card
          className="border-2 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => handleStatClick("active")}
        >
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

        <Card
          className="border-2 hover:border-green-500/50 transition-colors cursor-pointer"
          onClick={() => handleStatClick("completed")}
        >
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

        <Card
          className="border-2 hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onClick={() => handleStatClick("archived")}
        >
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
              <FolderKanban className="mr-2 h-5 w-5" />
              {t("dashboard.emptyState.action")}
            </Button>
          </CardContent>
        </Card>
      )}

      {stats.total > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("dashboard.recentProjects.title")}
              </h2>
              <p className="text-muted-foreground mt-1">
                {t("dashboard.recentProjects.description")}
              </p>
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
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedProjects.map((project) => (
                <Card
                  key={project.id}
                  className="border-2 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-1">
                          {project.name}
                        </CardTitle>
                        {project.description && (
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        )}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          project.status === "active"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t(`dashboard.status.${project.status}`)}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2">
              <div className="divide-y">
                <div className="flex items-center gap-6 p-4 bg-muted/50">
                  <div className="w-72 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("dashboard.list.name")}
                    </p>
                  </div>
                  <div className="flex-1 text-sm font-medium text-muted-foreground">
                    {t("dashboard.list.description")}
                  </div>
                  <div className="w-48 text-sm font-medium text-muted-foreground text-center">
                    {t("dashboard.list.lastUpdate")}
                  </div>
                  <div className="w-28 text-sm font-medium text-muted-foreground text-center">
                    {t("dashboard.list.status")}
                  </div>
                </div>
                {displayedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-6 p-4 hover:bg-accent/5 transition-colors cursor-pointer"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="w-72 min-w-0">
                      <p className="font-medium truncate">{project.name}</p>
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground truncate">
                      {project.description
                        ? truncateText(project.description, 130)
                        : "-"}
                    </div>
                    <div className="w-48 text-sm text-muted-foreground text-center">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="w-28 flex justify-center">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          project.status === "active"
                            ? "bg-primary/10 text-primary"
                            : project.status === "completed"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t(`dashboard.status.${project.status}`)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {hasMoreProjects && (
            <div className="flex justify-center pt-4">
              <Button onClick={handleLoadMore} variant="outline">
                {t("common.loadMore")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
