import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookmarkCheck,
  Compass,
  GraduationCap,
  School,
  Sparkles,
  Brain,
  Map,
  BookOpenCheck,
  CheckCircle2,
} from "lucide-react";
import { pageMeta, useI18n } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/categories";
import { buttonVariants } from "@/components/ui/button";
import { CompassMark } from "@/components/site/Brand";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => pageMeta("meta.homeTitle", "meta.homeDescription"),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const { session } = useAuth();

  return (
    <>
      <section className="bg-hero-gradient text-hero-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
          <div className="animate-rise">
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">Your future has more than one path.</h1>
            <p className="mt-5 max-w-xl text-lg text-hero-muted md:text-xl">
              CareerCompass helps Indian students after Class 10 and Class 12 explore streams, careers, entrance exams, and
              roadmaps — so you can make informed choices.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/after-10th" className={buttonVariants({ variant: "hero", size: "lg" })}>
                Explore After 10th <ArrowRight />
              </Link>
              <Link to="/after-12th" className={buttonVariants({ variant: "heroOutline", size: "lg" })}>
                Explore After 12th <ArrowRight />
              </Link>
              <Link to="/assessment" className={buttonVariants({ variant: "heroOutline", size: "lg" })}>
                Take Interest Assessment
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-bold text-hero-muted">{t("language.label")}</span>
              <LanguageSwitcher />
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <CompassMark animated className="size-72 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="journey-h">
        <h2 id="journey-h" className="text-3xl font-bold text-navy">Explore Your Journey</h2>
        <p className="mt-1 text-muted-foreground">Start based on where you are in your education</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            { key: "after10", icon: School, tone: "bg-teal/15 text-teal", to: "/after-10th" },
            { key: "after12", icon: GraduationCap, tone: "bg-violet/15 text-violet", to: "/after-12th" },
          ].map((s) => (
            <Link
              key={s.key}
              to={s.to}
              className="group flex items-start gap-4 rounded-3xl bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl", s.tone)}>
                <s.icon className="size-7" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="font-display text-2xl font-bold text-navy">
                  {s.key === "after10" ? "After Class 10" : "After Class 12"}
                </span>
                <span className="mt-1 block text-muted-foreground">
                  {s.key === "after10"
                    ? "PUC/Streams, Polytechnic, ITI and vocational education"
                    : "Degrees, professional courses, entrance exams by stream"}
                </span>
              </span>
              <ArrowRight className="mt-2 size-6 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6" aria-labelledby="cat-h">
        <h2 id="cat-h" className="text-3xl font-bold text-navy">Explore Career Categories</h2>
        <p className="mt-1 text-muted-foreground">Discover fields across different domains</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => {
            const name = t(`categories.${c.slug}`);
            return (
              <li key={c.slug}>
                <Link
                  to="/careers"
                  search={{ category: c.slug as any }}
                  aria-label={`Explore ${name}`}
                  className="flex h-full flex-col gap-3 rounded-3xl bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className={cn("flex size-12 items-center justify-center rounded-2xl", c.tone)}>
                    <c.icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="font-bold leading-snug text-navy">{name}</span>
                  <span className="mt-auto text-xs text-primary">Explore →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="how-h">
        <h2 id="how-h" className="text-3xl font-bold text-navy">How CareerCompass Works</h2>
        <p className="mt-1 text-muted-foreground">A simple path to clarity</p>
        <ol className="mt-6 grid gap-5 md:grid-cols-5">
          {[
            { title: "Choose your education stage", desc: "After 10th or After 12th", icon: School },
            { title: "Explore possible pathways", desc: "Streams, courses and options", icon: Compass },
            { title: "Discover relevant careers", desc: "Find careers that fit you", icon: BookOpenCheck },
            { title: "Understand skills and exams", desc: "Know what to prepare for", icon: CheckCircle2 },
            { title: "Build your roadmap", desc: "Plan step by step", icon: Map },
          ].map((s, i) => (
            <li key={i} className="rounded-3xl bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="size-6" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            to="/assessment"
            className="group flex items-start gap-4 rounded-3xl bg-gradient-to-br from-violet/10 to-primary/10 p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet/20 text-violet">
              <Brain className="size-7" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="font-display text-2xl font-bold text-navy">Interest Assessment</span>
              <span className="mt-1 block text-muted-foreground">
                Answer 8 questions to get suggested careers based on your interests (not a guaranteed match)
              </span>
            </span>
            <ArrowRight className="mt-2 size-6 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            to="/roadmaps"
            className="group flex items-start gap-4 rounded-3xl bg-gradient-to-br from-teal/10 to-primary/10 p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal/20 text-teal">
              <Map className="size-7" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="font-display text-2xl font-bold text-navy">Interactive Career Roadmaps</span>
              <span className="mt-1 block text-muted-foreground">Visualize pathways from Class 10 to your dream career</span>
            </span>
            <ArrowRight className="mt-2 size-6 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-navy">Featured Career Pathways</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { from: "Class 10", path: "Science PCM → Engineering → Software Development" },
            { from: "Class 10", path: "Commerce → B.Com → Banking & Finance" },
            { from: "Class 12 PCB", path: "PCB → MBBS/BDS → Healthcare Career" },
          ].map((p, i) => (
            <Link
              key={i}
              to="/roadmaps"
              className="rounded-3xl bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="text-sm text-muted-foreground">{p.from}</div>
              <div className="mt-1 font-bold text-navy">{p.path}</div>
              <div className="mt-2 text-sm text-primary">View roadmap →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-3xl bg-hero-gradient p-8 text-hero-foreground md:p-12">
          <h2 className="text-3xl font-bold">Ready to explore your future?</h2>
          <p className="mt-2 max-w-xl text-hero-muted">
            Start with After 10th or After 12th guides, take the interest assessment, or browse careers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/careers" className={buttonVariants({ variant: "hero", size: "lg" })}>
              Browse Careers <ArrowRight />
            </Link>
            <Link to="/exams" className={buttonVariants({ variant: "heroOutline", size: "lg" })}>
              Entrance Exams
            </Link>
            {session ? (
              <Link to="/saved" className={buttonVariants({ variant: "heroOutline", size: "lg" })}>
                Saved Careers
              </Link>
            ) : (
              <Link to="/signup" className={buttonVariants({ variant: "heroOutline", size: "lg" })}>
                Create free account
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
