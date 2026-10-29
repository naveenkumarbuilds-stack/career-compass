import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    const builder = {
      middleware: () => builder,
      validator: () => builder,
      handler: (fn: unknown) => fn,
    };
    return builder;
  },
}));
vi.mock("@/integrations/supabase/auth-middleware", () => ({ requireSupabaseAuth: {} }));
import { askGuide } from "@/lib/ai-guide";
const invoke = askGuide as unknown as (options: {
  data: { messages: { role: "user"; content: string }[]; language: "en" };
}) => Promise<{ answer: string; error: string }>;
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("Groq career guide", () => {
  it("redirects PDF generation requests without calling the provider", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const result = await invoke({data:{messages:[{role:"user",content:"Generate a PDF of my roadmap"}],language:"en"}});
    expect(result.error).toBe("");
    expect(result.answer).toContain("cannot create");
    expect(result.answer).toContain("Roadmaps");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("reports missing setup without calling the provider", async () => {
    vi.stubEnv("GROQ_API_KEY", "");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const result = await invoke({
      data: { messages: [{ role: "user", content: "Explain careers" }], language: "en" },
    });
    expect(result.error).toContain("setup");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("returns the answer using server-side credentials and app context", async () => {
    vi.stubEnv("GROQ_API_KEY", "test-only-key");
    const fetch = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "Start with a small design project." } }],
        }),
      });
    vi.stubGlobal("fetch", fetch);
    const result = await invoke({
      data: { messages: [{ role: "user", content: "How do I explore design?" }], language: "en" },
    });
    expect(result.answer).toContain("design project");
    const init = fetch.mock.calls[0]?.[1];
    expect(init.headers.Authorization).toBe("Bearer test-only-key");
    expect(JSON.parse(init.body).messages[0].content).toContain("dataset is draft guidance");
  });
  it("handles provider rate limits without exposing raw errors", async () => {
    vi.stubEnv("GROQ_API_KEY", "test-only-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    const result = await invoke({
      data: { messages: [{ role: "user", content: "Help" }], language: "en" },
    });
    expect(result.error).toContain("busy");
    expect(result.answer).toBe("");
  });
});

