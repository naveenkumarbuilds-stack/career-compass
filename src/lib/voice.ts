import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
export const transcribeVoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((value: unknown) =>
    z
      .object({
        audio: z
          .string()
          .min(1)
          .max(4000000)
          .regex(/^[A-Za-z0-9+/=]+$/),
        mime: z.enum(["audio/webm", "audio/mp4", "audio/ogg"]),
        language: z.enum(["en", "kn"]),
      })
      .parse(value),
  )
  .handler(async ({ data }) => {
    const key = process.env["GROQ_API_KEY"];
    if (!key) return { text: "", error: "Voice transcription is awaiting service setup." };
    try {
      const bytes = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0));
      const form = new FormData();
      form.append(
        "file",
        new Blob([bytes], { type: data.mime }),
        `question.${data.mime.split("/")[1]}`,
      );
      form.append("model", "whisper-large-v3-turbo");
      form.append("language", data.language);
      form.append("response_format", "json");
      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}` },
        body: form,
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok)
        return {
          text: "",
          error:
            response.status === 429
              ? "Voice service is busy. Please try again shortly."
              : "Unable to transcribe this recording. Please try again.",
        };
      const result = (await response.json()) as { text?: string };
      return {
        text: result.text?.trim().slice(0, 2000) || "",
        error: result.text?.trim() ? "" : "No speech detected. Please try again.",
      };
    } catch {
      return { text: "", error: "Voice service could not connect. Please try again." };
    }
  });
