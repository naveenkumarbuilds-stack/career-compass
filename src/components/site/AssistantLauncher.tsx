import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/i18n";
export function AssistantLauncher() {
  const { t } = useI18n();
  return (
    <Link
      to="/ai-guide"
      aria-label={t("nav.aiGuide")}
      className="fixed bottom-20 left-4 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 font-bold text-primary-foreground shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 md:bottom-6"
    >
      <Sparkles className="size-5" aria-hidden="true" />
      <span>{t("nav.aiGuide")}</span>
    </Link>
  );
}
