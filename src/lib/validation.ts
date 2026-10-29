import { z } from "zod";

// Messages are translation keys, resolved with t() in the UI.
export const nameSchema = z
  .string()
  .trim()
  .min(1, "validation.nameRequired")
  .max(100, "validation.nameTooLong");
export const langSchema = z.enum(["en", "kn"], { message: "validation.languageRequired" });
export const stageSchema = z.enum(["after_10th", "after_12th"], { message: "validation.stageRequired" });

export const signupSchema = z.object({
  full_name: nameSchema,
  email: z.string().trim().max(255, "validation.emailInvalid").email("validation.emailInvalid"),
  password: z.string().min(8, "validation.passwordShort").max(72, "validation.passwordLong"),
  preferred_language: langSchema,
  stage: stageSchema,
  guardian_permission_ack: z.literal(true, { message: "validation.guardianRequired" }),
});

export const loginSchema = z.object({
  email: z.string().trim().email("validation.emailInvalid"),
  password: z.string().min(1, "validation.passwordRequired"),
});

export const profileSchema = z.object({
  full_name: nameSchema,
  preferred_language: langSchema,
  stage: stageSchema,
});

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const k = String(issue.path[0] ?? "form");
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

/** Only allow same-origin relative paths as post-login destinations. */
export function safeRedirect(value: unknown, fallback = "/profile"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (value.startsWith("/login") || value.startsWith("/signup")) return fallback;
  return value;
}

/** Map auth provider errors to translation keys; never show raw provider text. */
export function authErrorKey(err: { message?: string; code?: string; status?: number } | null | undefined): string {
  if (!err) return "errors.generic";
  const code = err.code ?? "";
  const msg = (err.message ?? "").toLowerCase();
  if (code === "invalid_credentials" || msg.includes("invalid login")) return "errors.invalidCredentials";
  if (code === "email_not_confirmed" || msg.includes("not confirmed")) return "errors.emailNotConfirmed";
  if (code === "user_already_exists" || code === "email_exists" || msg.includes("already registered"))
    return "errors.userExists";
  if (code === "weak_password" || msg.includes("pwned") || msg.includes("weak")) return "errors.weakPassword";
  if (code.startsWith("over_") || err.status === 429 || msg.includes("rate limit")) return "errors.rateLimited";
  if (code === "signup_disabled") return "errors.signupDisabled";
  if (msg.includes("fetch") || msg.includes("network")) return "errors.network";
  return "errors.generic";
}
