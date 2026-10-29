import { z } from "zod";
export const HISTORY_KEY = "careercompass_history";
export const PROGRESS_KEY = "careercompass_progress";
const historySchema = z.array(
  z.object({ id: z.string(), completedAt: z.string(), slugs: z.array(z.string()) }),
);
export type AssessmentRecord = z.infer<typeof historySchema>[number];
export function readHistory(): AssessmentRecord[] {
  try {
    return historySchema.parse(JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"));
  } catch {
    return [];
  }
}
export function recordAssessment(slugs: string[]) {
  const next = [
    { id: crypto.randomUUID(), completedAt: new Date().toISOString(), slugs },
    ...readHistory(),
  ].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("careercompass-planning"));
  return next;
}
export function readProgress(): Record<string, string[]> {
  try {
    return z
      .record(z.string(), z.array(z.string()))
      .parse(JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"));
  } catch {
    return {};
  }
}
export function readBookmarks(): string[] {
  try {
    return z
      .array(z.string())
      .parse(JSON.parse(localStorage.getItem("careercompass_saved") || "[]"));
  } catch {
    return [];
  }
}
