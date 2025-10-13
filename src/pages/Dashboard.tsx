import { Plus, FolderKanban, CheckCircle2, Archive } from "lucide-react";
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

const DEBUG = import.meta.env.DEV;

export default function Dashboard() {
  const { projects, loading, error } = useProjects();
  const { t } = useTranslation();

  if (DEBUG) console.log("[Dashboard] render:", { projects, loading, error });

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: 0,
    archived: projects.filter((p) => p.status === "archived").length,
  };

  if (DEBUG) console.log("[Dashboard] stats:", stats);

  const handleNewProject = () => {
    if (DEBUG) console.log("[Dashboard] handleNewProject: triggered");
  };

  if (loading) {
    if (DEBUG) console.log("[Dashboard] render: loading state");
    return <div>{t("common.loading")}</div>;
  }

  if (error) {
    if (DEBUG) console.error("[Dashboard] render: error state", error);
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-destructive">
          {t("common.error")}
        </h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h2>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <Button onClick={handleNewProject} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.newProject")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.stats.total")}
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.stats.active")}
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.stats.completed")}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.stats.archived")}
            </CardTitle>
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
            <CardTitle>{t("dashboard.emptyState.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.emptyState.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleNewProject}>
              <Plus className="mr-2 h-4 w-4" />
              {t("dashboard.emptyState.action")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
