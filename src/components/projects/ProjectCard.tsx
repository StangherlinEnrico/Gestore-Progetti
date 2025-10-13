import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import type { Project } from "../../types/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  active: { label: "Attivo", variant: "default" as const },
  completed: { label: "Completato", variant: "secondary" as const },
  archived: { label: "Archiviato", variant: "outline" as const },
  deleted: { label: "Eliminato", variant: "destructive" as const },
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const status = statusConfig[project.status];

  return (
    <Card className="group hover:shadow-medium transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <CardDescription className="mt-1.5 line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/progetti/${project.id}`}>Apri dettagli</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(project)}>
                Modifica
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(project.id)}
                className="text-destructive"
              >
                Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        <Badge variant={status.variant}>{status.label}</Badge>
      </CardFooter>
    </Card>
  );
}
