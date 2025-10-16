import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Project } from "../../db/database";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { FolderOpen, CheckCircle2, Archive, Sparkles } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(100),
  description: z.string().max(500).optional(),
  status: z.enum(["active", "completed", "archived"]),
});

type ProjectFormData = z.infer<typeof formSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSubmit: (data: ProjectFormData) => void;
}

const statusConfig = {
  active: {
    icon: FolderOpen,
    label: "Attivo",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completato",
    color: "text-success",
    bg: "bg-success/10",
  },
  archived: {
    icon: Archive,
    label: "Archiviato",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
};

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSubmit,
}: ProjectDialogProps) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active" as const,
    },
  });

  useEffect(() => {
    if (project) {
      const projectStatus =
        project.status === "deleted" ? "archived" : project.status;
      form.reset({
        name: project.name,
        description: project.description || "",
        status: projectStatus,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        status: "active" as const,
      });
    }
  }, [project, form, open]);

  const handleSubmit = (data: ProjectFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[580px] p-0 gap-0 overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent pointer-events-none" />
          <DialogHeader className="space-y-3 p-6 pb-4 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold">
                  {project ? "Modifica progetto" : "Nuovo progetto"}
                </DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  {project
                    ? "Modifica le informazioni del progetto"
                    : "Inserisci i dettagli del nuovo progetto"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5 px-6 pb-6"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground/90">
                    Nome progetto
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="es. Sviluppo App Mobile"
                      className="h-11 border-border/50 focus-visible:ring-primary/20"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground/90">
                    Descrizione
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Aggiungi una descrizione dettagliata del progetto..."
                      className="resize-none min-h-[110px] border-border/50 focus-visible:ring-primary/20"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground/90">
                    Stato del progetto
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 border-border/50 focus:ring-primary/20">
                        <SelectValue placeholder="Seleziona stato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([value, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem
                            key={value}
                            value={value}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-3 py-1">
                              <div
                                className={`w-8 h-8 rounded-md ${config.bg} flex items-center justify-center flex-shrink-0`}
                              >
                                <Icon className={`h-4 w-4 ${config.color}`} />
                              </div>
                              <span className="font-medium">
                                {config.label}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 min-w-[100px]"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                className="h-10 min-w-[140px] bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {project ? "Salva modifiche" : "Crea progetto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
