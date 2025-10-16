import { FolderKanban, CheckCircle2, Archive, TrendingUp } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

import { TitleRow } from "../components/ui/titleRow";
import { StatCard } from "../components/dashboard/statCard";
import { MissProjects } from "../components/dashboard/missProjects";
import { RecentProjects } from "../components/dashboard/recentProjects";

export default function Dashboard() {
  const { projects, loading, error } = useProjects();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    archived: projects.filter((p) => p.status === "archived").length,
  };

  const handleRedirectProjects = () => {
    navigate("/projects?action=create");
  };

  const handleStatClick = (status: string) => {
    // TODO: Implementare navigazione alla pagina progetti con filtro
    console.log("TODO: Navigare a /projects con filtro status:", status);
  };

  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

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
      {/* Title */}
      <TitleRow title="dashboard.title" subtitle="dashboard.subtitle" />

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="dashboard.stats.total"
          icon={FolderKanban}
          count={stats.total}
          description="dashboard.stats.totalDescription"
        />

        <StatCard
          title="dashboard.stats.active"
          icon={TrendingUp}
          count={stats.active}
          description="dashboard.stats.activeDescription"
          onClick={() => handleStatClick("active")}
        />

        <StatCard
          title="dashboard.stats.completed"
          icon={CheckCircle2}
          count={stats.completed}
          description="dashboard.stats.completedDescription"
          onClick={() => handleStatClick("completed")}
        />

        <StatCard
          title="dashboard.stats.archived"
          icon={Archive}
          count={stats.archived}
          description="dashboard.stats.archivedDescription"
          onClick={() => handleStatClick("archived")}
        />
      </div>

      {/* No projects */}
      {stats.total === 0 && (
        <MissProjects
          icon={FolderKanban}
          title="dashboard.emptyState.title"
          description="dashboard.emptyState.description"
          buttonIcon={FolderKanban}
          buttonText="dashboard.emptyState.action"
          buttonClick={handleRedirectProjects}
        />
      )}

      {/* No active projects */}
      {stats.total !== 0 && stats.active === 0 && (
        <MissProjects
          icon={CheckCircle2}
          title="dashboard.noActiveProjects.title"
          description="dashboard.noActiveProjects.description"
          buttonIcon={CheckCircle2}
          buttonText="dashboard.noActiveProjects.action"
          buttonClick={handleRedirectProjects}
        />
      )}

      {/* Recent projects */}
      {stats.total > 0 && stats.active > 0 && (
        <RecentProjects projects={sortedProjects} />
      )}
    </div>
  );
}
