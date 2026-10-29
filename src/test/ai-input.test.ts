import { describe, expect, it } from "vitest";
import { guideInput, conversationContext } from "@/lib/ai-input";
describe("Continuing AI conversations", () => {
  it("accepts a long assistant reply in the next request", () => {
    expect(
      guideInput.safeParse({
        messages: [
          { role: "user", content: "Explain design" },
          { role: "assistant", content: "A".repeat(5000) },
          { role: "user", content: "What next?" },
        ],
        language: "en",
      }).success,
    ).toBe(true);
  });
  it("still limits typed questions", () => {
    expect(
      guideInput.safeParse({
        messages: [{ role: "user", content: "A".repeat(2001) }],
        language: "en",
      }).success,
    ).toBe(false);
  });
  it("retains complete recent exchanges beginning with a user", () => {
    const messages = Array.from({ length: 15 }, (_, i) => ({
      role: i % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: "Message " + i,
    }));
    const context = conversationContext(messages);
    expect(context).toHaveLength(11);
    expect(context[0]?.role).toBe("user");
    expect(context.at(-1)?.content).toBe("Message 14");
  });
});
