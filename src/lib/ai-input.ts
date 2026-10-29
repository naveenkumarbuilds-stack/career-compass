import { z } from "zod";
export const guideInput = z.object({
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({ role: z.literal("user"), content: z.string().trim().min(1).max(2000) }),
        z.object({ role: z.literal("assistant"), content: z.string().trim().min(1).max(16000) }),
      ]),
    )
    .min(1)
    .max(11),
  language: z.enum(["en", "kn"]),
});
export function conversationContext(messages: { role: "user" | "assistant"; content: string }[]) {
  return messages.slice(-11);
}
