import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/explore")({
  validateSearch: (s: Record<string, unknown>): { category?: string } =>
    typeof s["category"] === "string" ? { category: s["category"] } : {},
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/careers", search });
  },
});
