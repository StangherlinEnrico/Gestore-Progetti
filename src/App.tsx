import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";
import Settings from "./pages/Settings";
import "./i18n";
import Projects from "./pages/Projects";

const DEBUG = import.meta.env.DEV;

function App() {
  useEffect(() => {
    if (DEBUG) console.log("[App] mounted");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const currentTheme = localStorage.getItem("app_preferences");
      if (currentTheme) {
        const preferences = JSON.parse(currentTheme);
        if (preferences.theme === "system") {
          if (e.matches) {
            document.documentElement.classList.add("dark");
            if (DEBUG) console.log("[App] system theme changed to dark");
          } else {
            document.documentElement.classList.remove("dark");
            if (DEBUG) console.log("[App] system theme changed to light");
          }
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/info" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
