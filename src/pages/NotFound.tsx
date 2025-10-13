import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import { Button } from "../components/ui/button";

const DEBUG = import.meta.env.DEV;

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (DEBUG) {
      console.error(
        "[NotFound] User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">{t("notFound.title")}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("notFound.description")}
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            {t("notFound.backHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
