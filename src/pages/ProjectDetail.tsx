import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { ProjectDialog } from "../components/projects/ProjectDialog";
import { DeleteRequest } from "../components/ui/deleteRequest";
import { db } from "../db/database";
import type { Project } from "../db/database";
import { Badge } from "../components/ui/badge";
import { useTranslation } from "react-i18next";
import { TitleRow } from "../components/ui/titleRow";

export default function ProjectDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    const projectData = await db.getProjectById(id);
    setProject(projectData);
  };

  const handleEditProject = async (data: {
    name: string;
    description?: string;
    status: "active" | "completed" | "archived";
  }) => {
    if (!project) return;
    await db.updateProject(project.id, {
      name: data.name,
      description: data.description,
      status: data.status,
    });
    await loadProject();
    setDialogOpen(false);
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    await db.deleteProject(project.id);
    navigate("/projects");
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

  if (!project) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
          <p className="text-base text-muted-foreground">
            {t("projects.loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-start gap-4 pt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/projects")}
          className="mt-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <TitleRow custom={true} title={project.name} />
          <Badge variant={getStatusVariant(project.status)} className="mt-3">
            {t(`projects.status.${project.status}`)}
          </Badge>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {t("projects.edit")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("projects.delete")}
          </Button>
        </div>
      </div>

      {project.description && project.description.trim() !== "" && (
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-8 shadow-sm">
          <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={project}
        onSubmit={handleEditProject}
      />

      <DeleteRequest
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteProject}
        title={t("projects.deleteTitle")}
        description={t("projects.deleteDescription")}
        itemName={project.name}
        confirmText={t("projects.delete")}
        cancelText={t("common.cancel")}
      />
    </div>
  );
}
