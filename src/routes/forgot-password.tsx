import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/site/FormField";
export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = z.string().trim().email().safeParse(email);
    if (!parsed.success) {
      setMessage("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setMessage("Unable to send a recovery link right now. Please try again later.");
        return;
      }
      setSent(true);
    } catch {
      setMessage("Connection failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-3xl bg-card p-8 shadow-card">
        <h1 className="text-3xl font-bold text-navy">Forgot password?</h1>
        {sent ? (
          <p className="my-5" role="status">
            If an account exists for this address, you will receive a password recovery link. Check
            your inbox and spam folder.
          </p>
        ) : (
          <form onSubmit={submit} className="my-6 space-y-4">
            <p>Enter your account email to request a recovery link.</p>
            <label className="block">
              Email
              <input
                type="email"
                autoComplete="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <p role="alert">{message}</p>
            <Button type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send recovery link"}
            </Button>
          </form>
        )}
        <Link to="/login" className="text-primary underline">
          Back to login
        </Link>
      </div>
    </section>
  );
}
