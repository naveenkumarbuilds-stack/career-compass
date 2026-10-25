import { describe, expect, it } from "vitest";
import { authErrorKey, fieldErrors, profileSchema, safeRedirect, signupSchema } from "./validation";

describe("student signup", () => {
  const valid = { full_name: " Student ", email: "student@example.invalid", password: "test-password-123", preferred_language: "kn", stage: "after_12th", guardian_permission_ack: true };
  it("accepts minimal details and strips unsupported fields", () => {
    const result = signupSchema.parse({ ...valid, role: "admin", phone: "123" });
    expect(result.full_name).toBe("Student");
    expect(result).not.toHaveProperty("role");
    expect(result).not.toHaveProperty("phone");
  });
  it.each([
    ["full_name", ""], ["email", "invalid"], ["password", "short"],
    ["stage", "unknown"], ["preferred_language", "unknown"], ["guardian_permission_ack", false],
  ])("rejects invalid %s with a translation key", (field, value) => {
    const result = signupSchema.safeParse({ ...valid, [field]: value });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error)[field]).toMatch(/^validation\./);
  });
  it("allows only name, language and stage in profile updates", () => {
    const data = profileSchema.parse({ ...valid, id: "someone-else", guardian_permission_ack: false });
    expect(Object.keys(data).sort()).toEqual(["full_name", "preferred_language", "stage"]);
  });
});

describe("safe login destination", () => {
  it.each(["https://example.com", "//example.com", "/\\example.com", "/\n/example.com", "/login", "/signup", null])("rejects %s", value => {
    expect(safeRedirect(value)).toBe("/profile");
  });
  it("retains local destinations", () => expect(safeRedirect("/explore?category=science")).toBe("/explore?category=science"));
});

describe("auth messages", () => {
  it("never exposes raw provider errors", () => expect(authErrorKey({ message: "sensitive backend details" })).toBe("errors.generic"));
  it.each([["invalid_credentials", "errors.invalidCredentials"], ["email_not_confirmed", "errors.emailNotConfirmed"], ["over_request_rate_limit", "errors.rateLimited"]])("maps %s", (code, key) => expect(authErrorKey({ code })).toBe(key));
});
