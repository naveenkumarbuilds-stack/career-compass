import { describe, expect, it } from "vitest";
import { careers, exams, quiz, getExamsBySlugs } from "@/data";
import { safeRedirect } from "@/lib/validation";
describe("Career guidance content", () => {
  it("has unique career and exam destinations", () => {
    for (const records of [careers, exams])
      expect(new Set(records.map((r: any) => r.slug)).size).toBe(records.length);
  });
  it("resolves every exam linked from a career", () => {
    for (const career of careers)
      expect(getExamsBySlugs(career.exam_slugs)).toHaveLength(career.exam_slugs.length);
  });
  it("has usable assessment options and career matches", () => {
    for (const question of quiz.questions) {
      expect(question.options.length).toBeGreaterThan(1);
      for (const option of question.options)
        expect(
          careers.some((c: any) => c.interests.some((tag: string) => option.tags.includes(tag))),
        ).toBe(true);
    }
  });
  it("keeps login return paths inside the app", () => {
    expect(safeRedirect("//example.com")).toBe("/profile");
    expect(safeRedirect("/saved")).toBe("/saved");
  });
});
