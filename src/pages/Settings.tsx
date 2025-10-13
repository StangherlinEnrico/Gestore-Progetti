import { Download, Upload, Trash2, Moon, Sun, Languages } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { Switch } from "../components/ui/switch";
import { useSettings } from "../hooks/useSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const DEBUG = import.meta.env.DEV;

export default function Settings() {
  const { toast } = useToast();
  const { settings, updatePreferences, loading } = useSettings();

  const darkMode = settings?.preferences.theme === "dark";
  const currentLanguage = settings?.preferences.language || "it";

  const handleExport = () => {
    if (DEBUG) console.log("[Settings] handleExport: start");
    if (!settings) {
      if (DEBUG) console.warn("[Settings] handleExport: no settings available");
      return;
    }

    const data = JSON.stringify(settings, null, 2);
    if (DEBUG) console.log("[Settings] handleExport: data stringified", data);

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settings-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (DEBUG) console.log("[Settings] handleExport: backup created");
    toast({
      title: "Backup creato",
      description: "I dati sono stati esportati con successo",
    });
  };

  const handleImport = () => {
    if (DEBUG) console.log("[Settings] handleImport: start");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (DEBUG)
        console.log("[Settings] handleImport: file selected", file?.name);
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content = e.target?.result as string;
            if (DEBUG)
              console.log("[Settings] handleImport: file content read");
            const data = JSON.parse(content);
            if (DEBUG)
              console.log("[Settings] handleImport: data parsed", data);

            if (data.preferences) {
              if (DEBUG)
                console.log(
                  "[Settings] handleImport: updating preferences",
                  data.preferences
                );
              await updatePreferences(data.preferences);
              toast({
                title: "Importazione completata",
                description: "I dati sono stati importati con successo",
              });
              if (DEBUG)
                console.log("[Settings] handleImport: import successful");
            } else {
              throw new Error("Invalid data format");
            }
          } catch (error) {
            if (DEBUG) console.error("[Settings] handleImport: error", error);
            toast({
              title: "Errore",
              description: "File non valido",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAll = async () => {
    if (DEBUG) console.log("[Settings] handleClearAll: start");
    if (
      confirm(
        "Sei sicuro di voler ripristinare tutte le impostazioni? Questa azione non può essere annullata."
      )
    ) {
      if (DEBUG)
        console.log(
          "[Settings] handleClearAll: confirmed, resetting preferences"
        );
      await updatePreferences({
        theme: "system",
        language: "it",
        timezone: "Europe/Rome",
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      });

      toast({
        title: "Impostazioni ripristinate",
        description:
          "Le impostazioni sono state ripristinate ai valori predefiniti",
      });
      if (DEBUG) console.log("[Settings] handleClearAll: reset complete");
    } else {
      if (DEBUG) console.log("[Settings] handleClearAll: cancelled by user");
    }
  };

  const toggleDarkMode = async (checked: boolean) => {
    if (DEBUG) console.log("[Settings] toggleDarkMode:", checked);
    const newTheme = checked ? "dark" : "light";

    await updatePreferences({
      theme: newTheme,
    });

    if (checked) {
      document.documentElement.classList.add("dark");
      if (DEBUG) console.log("[Settings] toggleDarkMode: dark mode enabled");
    } else {
      document.documentElement.classList.remove("dark");
      if (DEBUG) console.log("[Settings] toggleDarkMode: dark mode disabled");
    }
  };

  const handleLanguageChange = async (language: string) => {
    if (DEBUG) console.log("[Settings] handleLanguageChange:", language);
    await updatePreferences({
      language,
    });

    toast({
      title: "Lingua aggiornata",
      description: `Lingua impostata su ${
        language === "it"
          ? "Italiano"
          : language === "en"
          ? "English"
          : language === "es"
          ? "Español"
          : language === "fr"
          ? "Français"
          : "Deutsch"
      }`,
    });
  };

  if (loading || !settings) {
    if (DEBUG)
      console.log("[Settings] render: loading state", {
        loading,
        hasSettings: !!settings,
      });
    return <div>Caricamento...</div>;
  }

  if (DEBUG) console.log("[Settings] render: ready", { settings, darkMode });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Impostazioni</h2>
        <p className="text-muted-foreground">
          Configura l'applicazione e gestisci i tuoi dati
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aspetto</CardTitle>
          <CardDescription>
            Personalizza l'aspetto dell'applicazione
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tema scuro</Label>
              <p className="text-sm text-muted-foreground">
                Attiva il tema scuro per ridurre l'affaticamento degli occhi
              </p>
            </div>
            <div className="flex items-center gap-2">
              {darkMode ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lingua</Label>
              <p className="text-sm text-muted-foreground">
                Seleziona la lingua dell'interfaccia
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <Select
                value={currentLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gestione dati</CardTitle>
          <CardDescription>
            Esporta, importa o ripristina le tue impostazioni
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Backup impostazioni</Label>
            <p className="text-sm text-muted-foreground">
              Esporta tutte le tue impostazioni in un file JSON
            </p>
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Esporta dati
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Importa impostazioni</Label>
            <p className="text-sm text-muted-foreground">
              Importa impostazioni da un file JSON di backup
            </p>
            <Button
              onClick={handleImport}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              Importa dati
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Ripristina impostazioni</Label>
            <p className="text-sm text-muted-foreground">
              Ripristina tutte le impostazioni ai valori predefiniti. Questa
              azione non può essere annullata.
            </p>
            <Button
              onClick={handleClearAll}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Ripristina impostazioni
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
