import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Grid3x3, List } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface RecentProjectsProps {
  projects: Project[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const originalDisplayCount = 9;
  const [displayCount, setDisplayCount] = useState(originalDisplayCount);

  const displayedProjects = useMemo(
    () => projects.slice(0, displayCount),
    [projects, displayCount]
  );

  const hasMoreProjects = projects.length > displayCount;

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + originalDisplayCount);
  };

  return (
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
              className="group border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader className="py-7">
                <div className="space-y-1.5">
                  <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-2 text-sm">
                      {project.description}
                    </CardDescription>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[200px]">
                  {t("dashboard.table.name")}
                </TableHead>
                <TableHead>{t("dashboard.table.description")}</TableHead>
                <TableHead className="w-[150px] text-center">
                  {t("dashboard.table.createdAt")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className="cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    {project.description || t("dashboard.table.noDescription")}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(project.createdAt).toLocaleDateString("it-IT")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {hasMoreProjects && (
        <div className="flex justify-center pt-4">
          <Button onClick={handleLoadMore} variant="outline">
            {t("common.loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}
