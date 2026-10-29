import { beforeEach, describe, expect, it } from "vitest";
import {
  readHistory,
  recordAssessment,
  readProgress,
  HISTORY_KEY,
  PROGRESS_KEY,
} from "@/lib/planning";
beforeEach(() => localStorage.clear());
describe("Student planning storage", () => {
  it("persists completed assessments newest first and retains twenty", () => {
    for (let i = 0; i < 22; i++) recordAssessment([`career-${i}`]);
    expect(readHistory()).toHaveLength(20);
    expect(readHistory()[0]?.slugs).toEqual(["career-21"]);
  });
  it("recovers from malformed history and progress", () => {
    localStorage.setItem(HISTORY_KEY, '{"unexpected":true}');
    localStorage.setItem(PROGRESS_KEY, '{"career":42}');
    expect(readHistory()).toEqual([]);
    expect(readProgress()).toEqual({});
  });
  it("keeps progress separate for each career", () => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ software: ["Build a project"], fitter: ["Complete training"] }),
    );
    expect(readProgress()["software"]).toEqual(["Build a project"]);
    expect(readProgress()["fitter"]).toEqual(["Complete training"]);
  });
});
