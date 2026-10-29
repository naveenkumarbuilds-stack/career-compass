import { VoiceInput, ReadReply } from "@/components/site/VoiceChat";
import { conversationContext } from "@/lib/ai-input";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askGuide } from "@/lib/ai-guide";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/i18n";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/ai-guide")({ component: Guide });
function Guide() {
  const { session } = useAuth();
  const { lang } = useI18n();
  const ask = useServerFn(askGuide);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function send(e: FormEvent) {
    e.preventDefault();
    if (busy || !question.trim()) return;
    setBusy(true);
    setError("");
    const next = [...messages, { role: "user" as const, content: question.trim() }];
    try {
      const result = await ask({ data: { messages: conversationContext(next), language: lang } });
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessages([...next, { role: "assistant", content: result.answer }]);
      setQuestion("");
    } catch {
      setError(
        "Unable to send your question. Check your connection and sign in again if necessary.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-navy">Your career guidance companion</h1>
      <p className="my-4 text-muted-foreground">
        The assessment discovers interests. Ask follow-up questions here to understand options,
        compare paths and plan your next step.
      </p>
      {!session ? (
        <div className="rounded-3xl bg-card p-8 shadow-card">
          <Link
            to="/login"
            search={{ redirect: "/ai-guide" }}
            className="font-bold text-primary underline"
          >
            Sign in to ask the assistant
          </Link>
        </div>
      ) : (
        <section className="rounded-3xl bg-card p-6 shadow-card">
          <p className="mb-5 text-sm text-muted-foreground">
            Questions are sent to Groq to generate replies. Avoid sharing personal details. AI can
            make mistakes; confirm admissions with official sources.
          </p>
          <div role="log" aria-label="Career conversation" aria-live="polite" className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap rounded-2xl p-4 ${m.role === "user" ? "ml-8 bg-primary/10" : "mr-8 bg-muted"}`}
              >
                <p className="mb-2 text-xs font-bold uppercase">
                  {m.role === "user" ? "You" : "Career guide"}
                </p>
                {m.content}
                {m.role === "assistant" && (
                  <div>
                    <ReadReply text={m.content} language={lang} />
                  </div>
                )}
              </div>
            ))}
          </div>
          {messages.length === 0 && (
            <div className="my-5 flex flex-wrap gap-2">
              {[
                "How do UI/UX and software development differ?",
                "How can I start exploring careers after Class 10?",
              ].map((q) => (
                <button
                  key={q}
                  className="rounded-xl border p-3 text-left text-sm"
                  onClick={() => setQuestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={send} className="mt-6 space-y-3">
            <label htmlFor="ai-question" className="font-semibold">
              Your question
            </label>
            <textarea
              id="ai-question"
              rows={3}
              maxLength={2000}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-xl border bg-card p-3"
            />
            <VoiceInput
              language={lang}
              disabled={busy}
              onTranscript={(text) => setQuestion(text)}
            />
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
            <div className="flex gap-3">
              <Button disabled={busy || !question.trim()} type="submit">
                {busy ? "Thinking…" : "Ask career guide"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setMessages([]);
                  setError("");
                }}
              >
                Clear conversation
              </Button>
            </div>
          </form>
        </section>
      )}
      <div className="mt-6 flex gap-5">
        <Link to="/assessment" className="text-primary underline">
          Interest assessment
        </Link>
        <Link to="/careers" className="text-primary underline">
          Compare careers
        </Link>
        <Link to="/roadmaps" className="text-primary underline">
          Roadmaps
        </Link>
      </div>
    </div>
  );
}
