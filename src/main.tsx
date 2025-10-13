import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { Toaster } from "./components/ui/toaster";
import { db } from "./db/database";
import i18n from "./i18n";

const DEBUG = import.meta.env.DEV;

const initializeApp = async () => {
  if (DEBUG) console.log("[main] initializeApp: start");

  try {
    const settings = await db.getSettings();
    if (DEBUG) console.log("[main] initializeApp: settings loaded", settings);

    const theme = settings.theme;
    const language = settings.language;

    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      if (DEBUG) console.log("[main] initializeApp: dark mode enabled");
    } else {
      document.documentElement.classList.remove("dark");
      if (DEBUG) console.log("[main] initializeApp: light mode enabled");
    }

    await i18n.changeLanguage(language);
    if (DEBUG) console.log("[main] initializeApp: language set to", language);

    if (DEBUG) console.log("[main] initializeApp: complete");
  } catch (error) {
    if (DEBUG) console.error("[main] initializeApp: error", error);
  }
};

initializeApp().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <SidebarProvider>
        <App />
        <Toaster />
      </SidebarProvider>
    </StrictMode>
  );
});
