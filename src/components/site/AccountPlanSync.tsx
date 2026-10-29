import { useState } from "react";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import {
  readBookmarks,
  readHistory,
  readProgress,
  HISTORY_KEY,
  PROGRESS_KEY,
} from "@/lib/planning";
import { Button } from "@/components/ui/button";
const planSchema = z.object({
  bookmarks: z.array(z.string()).max(100),
  progress: z.record(z.string(), z.array(z.string()).max(50)),
  history: z
    .array(z.object({ id: z.string(), completedAt: z.string(), slugs: z.array(z.string()) }))
    .max(20),
});
export function AccountPlanSync() {
  const { session } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function sync(restore: boolean) {
    if (!session || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const url = import.meta.env["VITE_SUPABASE_URL"];
      const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
      const endpoint = `${url}/rest/v1/student_plans`;
      const headers = {
        apikey: key,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      };
      if (restore) {
        const response = await fetch(
          `${endpoint}?user_id=eq.${encodeURIComponent(session.user.id)}&select=bookmarks,progress,history`,
          { headers },
        );
        if (!response.ok) throw new Error();
        const rows = await response.json();
        if (!Array.isArray(rows) || !rows[0]) {
          setMessage("No account backup yet. Save your plan first.");
          return;
        }
        const plan = planSchema.parse(rows[0]);
        const entries = [
          ["careercompass_saved", JSON.stringify(plan.bookmarks)],
          [PROGRESS_KEY, JSON.stringify(plan.progress)],
          [HISTORY_KEY, JSON.stringify(plan.history)],
        ] as const;
        const old = entries.map(([k]) => localStorage.getItem(k));
        try {
          entries.forEach(([k, v]) => localStorage.setItem(k, v));
        } catch {
          entries.forEach(([k], i) => {
            try {
              const value = old[i];
              if (value === null || value === undefined) localStorage.removeItem(k);
              else localStorage.setItem(k, value);
            } catch {
              /* Preserve available storage. */
            }
          });
          throw new Error();
        }
        window.dispatchEvent(new Event("careercompass-bookmarks"));
        window.dispatchEvent(new Event("careercompass-planning"));
        setMessage("Account plan restored. Reload open planning pages to see all changes.");
      } else {
        const plan = planSchema.parse({
          bookmarks: readBookmarks(),
          progress: readProgress(),
          history: readHistory(),
        });
        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            user_id: session.user.id,
            ...plan,
            updated_at: new Date().toISOString(),
          }),
        });
        if (!response.ok) throw new Error();
        setMessage("Plan saved to your account. Restore it from your profile on another device.");
      }
    } catch {
      setMessage(
        "Unable to sync your plan. Your browser data has been kept. Please sign in again or try later.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!session) return null;
  return (
    <section className="mt-6 rounded-2xl border p-5">
      <h2 className="text-xl font-bold">Your plan across devices</h2>
      <p className="my-3 text-sm text-muted-foreground">
        Save this browser’s bookmarks, roadmap progress and assessment history to your account. Each
        save replaces your previous account backup. Restoring replaces this browser’s plan.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button disabled={busy} onClick={() => sync(false)}>
          Save plan to account
        </Button>
        <Button disabled={busy} variant="outline" onClick={() => sync(true)}>
          Restore account plan
        </Button>
      </div>
      <p role="status" className="mt-3 text-sm">
        {busy ? "Syncing…" : message}
      </p>
    </section>
  );
}
