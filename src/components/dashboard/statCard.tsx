import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  count: number;
  description: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  icon: Icon,
  count,
  description,
  onClick,
}: StatCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      className={`border-2 hover:border-primary/50 transition-colors ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xl font-medium text-muted-foreground">
          {t(title)}
        </CardTitle>
        <div className="p-2 rounded-md bg-primary/10">
          <Icon className="h-5 w-7 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{count}</div>
        <p className="text-sm text-muted-foreground mt-2">{t(description)}</p>
      </CardContent>
    </Card>
  );
}
