import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LANGS, useI18n, type Lang } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const { session, profile, setProfile } = useAuth();
  const [busy, setBusy] = useState(false);

  async function choose(l: Lang) {
    if (l === lang || busy) return;
    if (session && profile) {
      setBusy(true);
      try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ preferred_language: l })
        .eq("id", session.user.id)
        .select()
        .single();
      if (error || !data) { toast.error(t("errors.generic")); return; }
      setProfile(data);
      } catch { toast.error(t("errors.network")); return; }
      finally { setBusy(false); }
    }
    setLang(l);
  }

  return (
    <div role="group" aria-label={t("language.switchLabel")} className={cn("inline-flex rounded-xl border-2 border-border bg-card p-0.5", className)}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          disabled={busy}
          onClick={() => void choose(l)}
          className={cn(
            "rounded-lg px-2 py-1 text-xs font-bold transition-colors sm:px-3 sm:text-sm disabled:opacity-50",
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(`language.${l}`)}
        </button>
      ))}
    </div>
  );
}

