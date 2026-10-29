import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/site/FormField";
import { z } from "zod";
export const Route = createFileRoute("/reset-password")({ component: ResetPassword });
function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let active = true;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setAllowed(!!session);
        setReady(true);
      }
    });
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (active) {
          setAllowed(!error && !!data.session);
          setReady(true);
        }
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!allowed) return;
    if (!z.string().min(8).max(72).safeParse(password).success) {
      setMessage("Use a password between 8 and 72 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage("Unable to update your password. Request a new recovery link and try again.");
        return;
      }
      setDone(true);
    } catch {
      setMessage("Connection failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-3xl bg-card p-8 shadow-card">
        <h1 className="text-3xl font-bold text-navy">Reset password</h1>
        {!ready ? (
          <p role="status">Checking your recovery link…</p>
        ) : done ? (
          <div>
            <p role="status" className="my-4">
              Your password has been updated.
            </p>
            <Link to="/profile" className="text-primary underline">
              Continue to your profile
            </Link>
          </div>
        ) : !allowed ? (
          <p className="my-4">
            This link is unavailable or expired.{" "}
            <Link to="/forgot-password" className="text-primary underline">
              Request another recovery link
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              New password
              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={72}
              />
            </label>
            <label className="block">
              Confirm password
              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </label>
            <p role="alert">{message}</p>
            <Button type="submit" disabled={busy}>
              {busy ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
