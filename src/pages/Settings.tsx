import { useState, useEffect, useRef } from "react";
import { Download, Upload, Trash2, Moon, Sun, Languages } from "lucide-react";
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

const DEBUG = import.meta.env.DEV;

export default function Settings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { settings, updatePreferences, loading } = useSettings();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const languageSelectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (settings) {
      if (DEBUG) console.log("[Settings] useEffect: settings loaded", settings);
      const isDark =
        settings.preferences.theme === "dark" ||
        (settings.preferences.theme === "system" &&
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
    if (DEBUG) console.log("[Settings] handleExport: start");
    if (!settings) {
      if (DEBUG) console.warn("[Settings] handleExport: no settings available");
      return;
    }

    const data = JSON.stringify(settings, null, 2);
    if (DEBUG) console.log("[Settings] handleExport: data stringified");

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
      title: t("settings.export.success"),
      description: t("settings.export.description"),
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
                title: t("settings.import.success"),
                description: t("settings.import.description"),
              });
              if (DEBUG)
                console.log("[Settings] handleImport: import successful");
            } else {
              throw new Error("Invalid data format");
            }
          } catch (error) {
            if (DEBUG) console.error("[Settings] handleImport: error", error);
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
    if (DEBUG) console.log("[Settings] handleClearAll: start");
    if (confirm(t("settings.reset.confirm"))) {
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
        title: t("settings.reset.success"),
        description: t("settings.reset.description"),
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

    try {
      await changeLanguage(language);

      const languageNames: Record<string, string> = {
        it: "Italiano",
        en: "English",
      };

      toast({
        title: t("settings.language.updated"),
        description: t("settings.language.description", {
          language: languageNames[language] || language,
        }),
      });

      if (languageSelectRef.current) {
        languageSelectRef.current.blur();
      }
    } catch (error) {
      if (DEBUG) console.error("[Settings] handleLanguageChange: error", error);
      toast({
        title: t("common.error"),
        description: t("settings.language.error"),
        variant: "destructive",
      });
    }
  };

  if (loading || !settings) {
    if (DEBUG)
      console.log("[Settings] render: loading state", {
        loading,
        hasSettings: !!settings,
      });
    return <div>{t("common.loading")}</div>;
  }

  if (DEBUG)
    console.log("[Settings] render: ready", {
      settings,
      darkMode,
      currentLanguage,
    });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("settings.title")}
        </h2>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.appearance.title")}</CardTitle>
          <CardDescription>
            {t("settings.appearance.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("settings.appearance.darkMode")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.appearance.darkModeDescription")}
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
              <Label>{t("settings.appearance.language")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.appearance.languageDescription")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <Select
                value={currentLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-[180px]" ref={languageSelectRef}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.data.title")}</CardTitle>
          <CardDescription>{t("settings.data.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("settings.data.export")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.data.exportDescription")}
            </p>
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("settings.data.exportButton")}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>{t("settings.data.import")}</Label>
            <p className="text-sm text-muted-foreground">
              {t("settings.data.importDescription")}
            </p>
            <Button
              onClick={handleImport}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Upload className="mr-2 h-4 w-4" />
              {t("settings.data.importButton")}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>{t("settings.data.reset")}</Label>
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
  );
}
