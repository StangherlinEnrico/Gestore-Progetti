import { useState, useEffect, useRef } from "react";
import {
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Languages,
  Palette,
  Database,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { useLanguage } from "../hooks/useLanguage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { settings, updateSettings, loading } = useSettings();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const languageSelectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (settings) {
      const isDark =
        settings.theme === "dark" ||
        (settings.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings]);

  const handleExport = () => {
    if (!settings) {
      return;
    }

    const data = JSON.stringify(settings, null, 2);

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

    toast({
      title: t("settings.export.success"),
      description: t("settings.export.description"),
    });
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content = e.target?.result as string;
            const data = JSON.parse(content);

            if (data.theme && data.language) {
              await updateSettings(data);

              const isDark =
                data.theme === "dark" ||
                (data.theme === "system" &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches);

              if (isDark) {
                document.documentElement.classList.add("dark");
              } else {
                document.documentElement.classList.remove("dark");
              }

              await i18n.changeLanguage(data.language);

              toast({
                title: t("settings.import.success"),
                description: t("settings.import.description"),
              });
            } else {
              throw new Error("Invalid data format");
            }
          } catch (error) {
            toast({
              title: t("common.error"),
              description: t("settings.import.error"),
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
    if (confirm(t("settings.reset.confirm"))) {
      await updateSettings({
        theme: "system",
        language: "it",
      });

      toast({
        title: t("settings.reset.success"),
        description: t("settings.reset.description"),
      });
    }
  };

  const toggleDarkMode = async (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";

    await updateSettings({
      theme: newTheme,
    });

    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLanguageChange = async (language: string) => {
    try {
      await changeLanguage(language);

      if (languageSelectRef.current) {
        languageSelectRef.current.blur();
      }
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("settings.language.error"),
        variant: "destructive",
      });
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("settings.title")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {t("settings.appearance.title")}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {t("settings.appearance.description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">
                    {t("settings.appearance.darkMode")}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("settings.appearance.darkModeDescription")}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div
                  className={`transition-colors ${
                    darkMode ? "text-muted-foreground" : "text-primary"
                  }`}
                >
                  <Sun className="h-5 w-5" />
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                  className="data-[state=checked]:bg-primary"
                />
                <div
                  className={`transition-colors ${
                    !darkMode ? "text-muted-foreground" : "text-primary"
                  }`}
                >
                  <Moon className="h-5 w-5" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">
                    {t("settings.appearance.language")}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("settings.appearance.languageDescription")}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <Languages className="h-5 w-5 text-muted-foreground" />
                <Select
                  value={currentLanguage}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-[180px]" ref={languageSelectRef}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {t("settings.data.title")}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {t("settings.data.description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <Label className="text-base font-medium">
                    {t("settings.data.export")}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("settings.data.exportDescription")}
                </p>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("settings.data.exportButton")}
                </Button>
              </div>

              <div className="space-y-3 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <Label className="text-base font-medium">
                    {t("settings.data.import")}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("settings.data.importDescription")}
                </p>
                <Button
                  onClick={handleImport}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t("settings.data.importButton")}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-destructive" />
                <Label className="text-base font-medium text-destructive">
                  {t("settings.data.reset")}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("settings.data.resetDescription")}
              </p>
              <Button
                onClick={handleClearAll}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("settings.data.resetButton")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
