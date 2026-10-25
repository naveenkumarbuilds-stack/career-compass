import { Briefcase, Cpu, FlaskConical, HeartPulse, Landmark, Palette, Scale, BookOpen } from "lucide-react";

// Placeholder category list only — no career content in Phase 1.
export const CATEGORIES = [
  { slug: "engineering", icon: Cpu, tone: "bg-primary/10 text-primary" },
  { slug: "healthcare", icon: HeartPulse, tone: "bg-coral/15 text-coral" },
  { slug: "commerce", icon: Landmark, tone: "bg-teal/15 text-teal" },
  { slug: "design", icon: Palette, tone: "bg-violet/15 text-violet" },
  { slug: "law", icon: Scale, tone: "bg-indigo/15 text-indigo" },
  { slug: "science", icon: FlaskConical, tone: "bg-teal/15 text-teal" },
  { slug: "management", icon: Briefcase, tone: "bg-amber/20 text-navy" },
  { slug: "arts", icon: BookOpen, tone: "bg-coral/15 text-coral" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as CategorySlug[];

