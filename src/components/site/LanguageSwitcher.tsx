import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LANGS, useI18n, type Lang } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const { session, profile, setProfile } = useAuth();

  async function choose(l: Lang) {
    if (l === lang) return;
    setLang(l);
    if (session && profile) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ preferred_language: l })
        .eq("id", session.user.id)
        .select()
        .single();
      if (error) toast.error(t("errors.generic"));
      else if (data) setProfile(data);
    }
  }

  return (
    <div role="group" aria-label={t("language.switchLabel")} className={cn("inline-flex rounded-xl border-2 border-border bg-card p-0.5", className)}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          onClick={() => void choose(l)}
          className={cn(
            "rounded-lg px-3 py-1 text-sm font-bold transition-colors",
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(`language.${l}`)}
        </button>
      ))}
    </div>
  );
}
