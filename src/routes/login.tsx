import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { pageMeta, useI18n } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { authErrorKey, fieldErrors, loginSchema, safeRedirect } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { FormField, describedBy, inputClass } from "@/components/site/FormField";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } =>
    typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
  head: () => pageMeta("meta.loginTitle", "meta.loginDescription"),
  component: Login,
});

function Login() {
  const { t } = useI18n();
  const { session, ready } = useAuth();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const target = safeRedirect(search.redirect);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && session) navigate({ to: target, replace: true });
  }, [ready, session, target, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) { setFormError("errors.notConfigured"); return; }
    setFormError(null);
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error) return setFormError(authErrorKey(error));
      toast.success(t("auth.loginSuccess"));
      navigate({ to: target, replace: true });
    } catch {
      setFormError("errors.network");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard title={t("auth.loginTitle")} subtitle={t("auth.loginSubtitle")}>
      {search.redirect && (
        <p role="status" className="mb-4 rounded-xl bg-accent px-4 py-3 font-semibold text-accent-foreground">
          {t("auth.redirectNotice")}
        </p>
      )}
      {!isSupabaseConfigured && <p role="status" className="mb-4 text-destructive">{t("errors.notConfigured")}</p>}
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormField id="email" label={t("auth.emailLabel")} error={errors["email"]}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors["email"]}
            aria-describedby={describedBy("email", errors["email"])}
          />
        </FormField>
        <FormField id="password" label={t("auth.passwordLabel")} error={errors["password"]}>
          <PasswordInput id="password" value={password} onChange={setPassword} show={show} setShow={setShow} error={errors["password"]} autoComplete="current-password" />
        </FormField>
        {formError && (
          <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 font-semibold text-destructive">
            {t(formError)}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy || !isSupabaseConfigured}>
          {busy ? t("auth.loggingIn") : t("auth.loginButton")}
        </Button>
      </form>
      <p className="mt-6 text-center text-muted-foreground">
        {t("auth.noAccount")}{" "}
        <Link to="/signup" search={search.redirect ? { redirect: search.redirect } : {}} className="font-bold text-primary underline-offset-4 hover:underline">
          {t("auth.goSignup")}
        </Link>
      </p>
    </AuthCard>
  );
}

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-lg px-4 py-12 animate-rise">
      <div className="rounded-3xl bg-card p-6 shadow-card md:p-8">
        <h1 className="text-3xl font-bold text-navy">{title}</h1>
        <p className="mb-6 mt-1 text-muted-foreground">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  show,
  setShow,
  error,
  hint,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
  error?: string | undefined;
  hint?: string | undefined;
  autoComplete: string;
}) {
  const { t } = useI18n();
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        className={`${inputClass} pr-14`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? t("auth.hidePassword") : t("auth.showPassword")}
        aria-pressed={show}
        className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
      >
        {show ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
      </button>
    </div>
  );
}

