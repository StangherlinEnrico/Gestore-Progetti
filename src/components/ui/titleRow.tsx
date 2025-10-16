import { useTranslation } from "react-i18next";

interface TitleRowProps {
  custom?: boolean;
  title: string;
  subtitle?: string;
}

export function TitleRow({ custom = false, title, subtitle }: TitleRowProps) {
  const { t } = useTranslation();

  const shouldShowSubtitle =
    subtitle && (custom ? subtitle.trim() !== "" : t(subtitle).trim() !== "");

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">
        {custom ? title : t(title)}
      </h1>
      {shouldShowSubtitle && (
        <p className="text-md text-muted-foreground">
          {custom ? subtitle : t(subtitle)}
        </p>
      )}
    </div>
  );
}
