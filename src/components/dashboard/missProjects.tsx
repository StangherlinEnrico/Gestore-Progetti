import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import type { LucideIcon } from "lucide-react";

interface MissProjectProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonIcon: LucideIcon;
  buttonText: string;
  buttonClick?: () => void;
}

export function MissProjects({
  icon: Icon,
  title,
  description,
  buttonIcon: ButtonIcon,
  buttonText,
  buttonClick,
}: MissProjectProps) {
  const { t } = useTranslation();

  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="text-center space-y-4 py-12">
        <div className="mx-auto p-4 rounded-full bg-primary/10 w-fit">
          <Icon className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">{t(title)}</CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            {t(description)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center pb-12">
        <Button onClick={buttonClick} size="lg">
          <ButtonIcon className="mr-2 h-5 w-5" />
          {t(buttonText)}
        </Button>
      </CardContent>
    </Card>
  );
}
