import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Calculator,
  Palette,
  Scale,
  FlaskConical,
} from "lucide-react";
import { pageMeta } from "@/i18n";
import { stageGuides } from "@/data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/after-12th")({
  head: () => pageMeta("meta.after12Title", "meta.after12Description"),
  component: After12th,
});

function After12th() {
  const guide = stageGuides?.after_12th;
  const icons = [Calculator, FlaskConical, FlaskConical, BookOpen, Palette, Scale];
  const tones = [
    "bg-primary/10 text-primary",
    "bg-teal/15 text-teal",
    "bg-violet/15 text-violet",
    "bg-coral/15 text-coral",
    "bg-amber/20 text-amber-700",
    "bg-indigo/15 text-indigo",
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-navy md:text-5xl">
          {guide?.title || "After 12th: your options by stream"}
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          {guide?.intro ||
            "After Class 12 you choose a degree and often an entrance exam. Start with your stream, then look at careers and exams."}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Note: Content is from draft data for guidance only. Always confirm on official sources.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        {(guide?.options || []).map((opt: any, idx: number) => {
          const Icon = icons[idx % icons.length]!;
          const tone = tones[idx % tones.length];
          return (
            <article key={idx} className="rounded-3xl bg-card p-6 shadow-card">
              <div className="flex items-start gap-4">
                <span className={cn("flex size-12 items-center justify-center rounded-2xl", tone)}>
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-navy">{opt.title}</h2>
                  <p className="mt-1 text-muted-foreground">{opt.who_its_for}</p>
                </div>
              </div>
              {Array.isArray(opt.leads_to) && opt.leads_to.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-navy">Relevant courses & careers</h3>
                  <ul className="mt-2 grid gap-1 text-muted-foreground">
                    {opt.leads_to.map((item: string, i: number) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {opt.note && (
                <div className="mt-4 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-navy">Important note: </span>
                  {opt.note}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to="/careers" className={buttonVariants({ variant: "outline" })}>
                  Explore Careers <ArrowRight />
                </Link>
                <Link to="/exams" className={buttonVariants({ variant: "ghost" })}>
                  Entrance Exams
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {Array.isArray(guide?.tips) && guide.tips.length > 0 && (
        <section className="mt-10 rounded-3xl bg-card p-6 shadow-card">
          <h2 className="text-2xl font-bold text-navy">Tips</h2>
          <ul className="mt-3 grid gap-2 text-muted-foreground">
            {guide.tips.map((tip: string, i: number) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/assessment" className={buttonVariants({ size: "lg" })}>
          Take Interest Assessment
        </Link>
        <Link to="/roadmaps" className={buttonVariants({ variant: "outline", size: "lg" })}>
          View Roadmaps
        </Link>
      </div>
    </div>
  );
}
