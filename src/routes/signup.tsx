import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { MailCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { pageMeta, useI18n, type Lang } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { authErrorKey, fieldErrors, safeRedirect, signupSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { ChoiceGroup, FormField, describedBy, inputClass } from "@/components/site/FormField";
import { AuthCard, PasswordInput } from "./login";

type Stage = "after_10th" | "after_12th";

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } =>
    typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
  head: () => pageMeta("meta.signupTitle", "meta.signupDescription"),
  component: Signup,
});

export function Signup() {
  const { t, lang, setLang } = useI18n();
  const { session, ready } = useAuth();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const target = safeRedirect(search.redirect);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    preferred_language: lang as Lang,
    stage: "" as Stage | "",
    guardian_permission_ack: false,
  });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    setForm(current => ({ ...current, preferred_language: lang }));
  }, [lang]);

  useEffect(() => {
    if (ready && session && !sentTo) navigate({ to: target, replace: true });
  }, [ready, session, sentTo, target, navigate]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) { setFormError("errors.notConfigured"); return; }
    setFormError(null);
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    const { email, password, ...meta } = parsed.data;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: meta,
        },
      });
      if (error) return setFormError(authErrorKey(error));
      if (data.user && data.user.identities?.length === 0) return setFormError("errors.userExists");
      setLang(meta.preferred_language);
      if (data.session) {
        toast.success(t("auth.loginSuccess"));
        navigate({ to: target, replace: true });
      } else {
        toast.success(t("auth.signupSuccess"));
        setSentTo(email);
      }
    } catch {
      setFormError("errors.network");
    } finally {
      setBusy(false);
    }
  }

  if (sentTo) {
    return (
      <AuthCard title={t("auth.checkEmailTitle")} subtitle="">
        <div role="status" className="flex flex-col items-center gap-4 text-center">
          <MailCheck className="size-16 text-teal" aria-hidden="true" />
          <p className="text-lg">{t("auth.checkEmailBody", { email: sentTo })}</p>
          <Link to="/login" className="font-bold text-primary underline-offset-4 hover:underline">
            {t("auth.goLogin")}
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title={t("auth.signupTitle")} subtitle={t("auth.signupSubtitle")}>
      {!isSupabaseConfigured && <p role="status" className="mb-4 text-destructive">{t("errors.notConfigured")}</p>}
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormField id="full_name" label={t("auth.nameLabel")} error={errors["full_name"]}>
          <input id="full_name" autoComplete="name" maxLength={100} className={inputClass} value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)} aria-invalid={!!errors["full_name"]}
            aria-describedby={describedBy("full_name", errors["full_name"])} />
        </FormField>
        <FormField id="email" label={t("auth.emailLabel")} error={errors["email"]}>
          <input id="email" type="email" autoComplete="email" className={inputClass} value={form.email}
            onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors["email"]}
            aria-describedby={describedBy("email", errors["email"])} />
        </FormField>
        <FormField id="password" label={t("auth.passwordLabel")} hint={t("auth.passwordHint")} error={errors["password"]}>
          <PasswordInput id="password" value={form.password} onChange={(v) => set("password", v)} show={show} setShow={setShow}
            error={errors["password"]} hint={t("auth.passwordHint")} autoComplete="new-password" />
        </FormField>
        <ChoiceGroup name="preferred_language" legend={t("auth.languageLabel")} value={form.preferred_language}
          error={errors["preferred_language"]}
          options={[{ value: "en", label: t("language.en"), lang: "en" }, { value: "kn", label: t("language.kn"), lang: "kn" }]}
          onChange={(v) => { set("preferred_language", v); setLang(v); }} />
        <ChoiceGroup name="stage" legend={t("auth.stageLabel")} value={form.stage} error={errors["stage"]}
          options={[{ value: "after_10th", label: t("stage.after_10th") }, { value: "after_12th", label: t("stage.after_12th") }]}
          onChange={(v) => set("stage", v)} />

        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-input bg-card p-4">
            <input type="checkbox" checked={form.guardian_permission_ack}
              onChange={(e) => set("guardian_permission_ack", e.target.checked)}
              aria-invalid={!!errors["guardian_permission_ack"]}
              aria-describedby={errors["guardian_permission_ack"] ? "guardian-error" : undefined}
              className="mt-1 size-5 shrink-0 accent-primary" />
            <span className="font-semibold">{t("auth.guardianLabel")}</span>
          </label>
          {errors["guardian_permission_ack"] && (
            <p id="guardian-error" role="alert" className="text-sm font-semibold text-destructive">
              {t(errors["guardian_permission_ack"])}
            </p>
          )}
        </div>

        <div className="flex gap-3 rounded-2xl bg-teal/10 p-4">
          <ShieldCheck className="size-6 shrink-0 text-teal" aria-hidden="true" />
          <div>
            <p className="font-bold text-navy">{t("auth.privacyTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("auth.privacyBody")}</p>
          </div>
        </div>

        {formError && (
          <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 font-semibold text-destructive">
            {t(formError)}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy || !isSupabaseConfigured}>
          {busy ? t("auth.signingUp") : t("auth.signupButton")}
        </Button>
      </form>
      <p className="mt-6 text-center text-muted-foreground">
        {t("auth.haveAccount")}{" "}
        <Link to="/login" search={search.redirect ? { redirect: search.redirect } : {}} className="font-bold text-primary underline-offset-4 hover:underline">
          {t("auth.goLogin")}
        </Link>
      </p>
    </AuthCard>
  );
}

