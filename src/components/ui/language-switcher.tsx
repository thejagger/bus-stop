import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useTranslation } from "react-i18next";
import GB from "country-flag-icons/react/3x2/GB";
import DE from "country-flag-icons/react/3x2/DE";

interface Language {
  code: string;
  Flag: React.ComponentType<React.SVGProps<SVGElement>>;
  labelKey: string;
}

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation("common");
  const current = i18n.resolvedLanguage || i18n.language || "en";

  const languages: Language[] = [
    { code: "de", Flag: DE, labelKey: "language.de" },
    { code: "en", Flag: GB, labelKey: "language.en" },
  ];

  const CurrentFlag = languages.find((l) => l.code === current)?.Flag || GB;

  const onChange = async (lng: string) => {
    if (lng !== current) {
      await i18n.changeLanguage(lng);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" className="rounded-3xl" aria-label={t("language.label")}>
          <CurrentFlag className="h-4 w-6" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ code, labelKey }) => (
          <DropdownMenuItem key={code} onClick={() => onChange(code)}>
            {t(labelKey)}
            <span className="sr-only">{t(labelKey)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
