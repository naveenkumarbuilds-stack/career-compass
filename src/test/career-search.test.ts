import { describe, it, expect } from "vitest";
import { matchesCareer } from "@/lib/career-search";
describe("Roadmap suggestions", () => {
  it("matches UI/UX in either order and ignores punctuation", () => {
    expect(matchesCareer("UX / UI Designer", "ui/")).toBe(true);
    expect(matchesCareer("UX / UI Designer", "ui/ux")).toBe(true);
    expect(matchesCareer("UX / UI Designer", "designer ui")).toBe(true);
    expect(matchesCareer("Software Developer", "ui/")).toBe(false);
  });
});
