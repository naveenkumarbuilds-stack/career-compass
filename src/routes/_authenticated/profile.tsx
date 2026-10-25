import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { pageMeta, useI18n, type Lang } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { authErrorKey, fieldErrors, profileSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { ChoiceGroup, FormField, describedBy, inputClass } from "@/components/site/FormField";

type Stage = "after_10th" | "after_12th";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => pageMeta("meta.profileTitle", "meta.profileDescription"),
  component: ProfilePage,
});

export function ProfilePage() {
  const { t, setLang } = useI18n();
  const { session, profile, profileError, setProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<{ full_name: string; preferred_language: Lang; stage: Stage }>({
    full_name: "",
    preferred_language: "en",
    stage: "after_10th",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (profile)
      setForm({ full_name: profile.full_name, preferred_language: profile.preferred_language, stage: profile.stage });
  }, [profile]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session) return;
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    try {
    const { data, error } = await supabase
      .from("profiles")
      .update(parsed.data)
      .eq("id", session.user.id)
      .select()
      .single();
    if (error || !data) return toast.error(t("errors.generic"));
    setProfile(data);
    setLang(data.preferred_language);
    toast.success(t("profile.saved"));
    } catch { toast.error(t("errors.network")); }
    finally { setBusy(false); }
  }

  async function logout() {
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) { toast.error(t(authErrorKey(error))); return; }
      toast.success(t("auth.loggedOut"));
      navigate({ to: "/login", replace: true });
    } catch { toast.error(t("errors.network")); }
    finally { setLoggingOut(false); }
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-12 animate-rise">
      <div className="rounded-3xl bg-card p-6 shadow-card md:p-8">
        <h1 className="text-3xl font-bold text-navy">{t("profile.title")}</h1>
        <p className="mb-6 mt-1 text-muted-foreground">{t("profile.subtitle")}</p>

        {!profile ? (
          <div role="status" className="space-y-4">
            <p className="text-muted-foreground">{profileError ? t("profile.loadError") : t("common.loading")}</p>
            {profileError && <Button variant="outline" onClick={() => void refreshProfile()}>{t("common.tryAgain")}</Button>}
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <FormField id="full_name" label={t("auth.nameLabel")} error={errors["full_name"]}>
              <input id="full_name" autoComplete="name" maxLength={100} className={inputClass} value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })} aria-invalid={!!errors["full_name"]}
                aria-describedby={describedBy("full_name", errors["full_name"])} />
            </FormField>
            <FormField id="email" label={t("auth.emailLabel")} hint={t("profile.emailReadOnly")}>
              <input id="email" type="email" readOnly disabled className={inputClass} value={session?.user.email ?? ""}
                aria-describedby="email-hint" />
            </FormField>
            <ChoiceGroup name="preferred_language" legend={t("auth.languageLabel")} value={form.preferred_language}
              error={errors["preferred_language"]}
              options={[{ value: "en", label: t("language.en"), lang: "en" }, { value: "kn", label: t("language.kn"), lang: "kn" }]}
              onChange={(v) => setForm({ ...form, preferred_language: v })} />
            <ChoiceGroup name="stage" legend={t("stage.label")} value={form.stage} error={errors["stage"]}
              options={[{ value: "after_10th", label: t("stage.after_10th") }, { value: "after_12th", label: t("stage.after_12th") }]}
              onChange={(v) => setForm({ ...form, stage: v })} />
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? t("profile.saving") : t("profile.save")}
            </Button>
          </form>
        )}
        <Button variant="outline" className="mt-4 w-full" disabled={loggingOut || busy} onClick={() => void logout()}>
          <LogOut aria-hidden="true" /> {t("profile.logout")}
        </Button>
      </div>
    </section>
  );
}

