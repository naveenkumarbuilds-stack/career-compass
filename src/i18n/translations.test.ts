import { describe, expect, it } from "vitest";
import en from "./en";
import kn from "./kn";
import { translate } from "./index";

function leaves(value: object, prefix = ""): Record<string, string> {
  return Object.fromEntries(Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === "string" ? [[path, child]] : Object.entries(leaves(child, path));
  }));
}
describe("translations", () => {
  it("provides every English key in Kannada, with matching placeholders", () => {
    const english = leaves(en), kannada = leaves(kn);
    expect(Object.keys(kannada).sort()).toEqual(Object.keys(english).sort());
    for (const [key, text] of Object.entries(english)) {
      expect(kannada[key]?.trim().length).toBeGreaterThan(0);
      expect(kannada[key]?.match(/\{\w+\}/g)?.sort() ?? []).toEqual(text.match(/\{\w+\}/g)?.sort() ?? []);
    }
  });
  it("preserves the requested headline exactly", () => expect(en.home.headline).toBe("Your Future Has More Than One Path. Let's Explore Yours."));
  it("fills translated placeholders", () => expect(translate(kn, "comingSoon.selectedCategory", { name: "Science" })).toContain("Science"));
});
