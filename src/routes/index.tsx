import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookmarkCheck, Compass, GraduationCap, School, Sparkles } from "lucide-react";
import { pageMeta, useI18n } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/categories";
import { buttonVariants } from "@/components/ui/button";
import { CompassMark, ComingSoonBadge } from "@/components/site/Brand";
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
            <h1 className="text-4xl font-extrabold md:text-6xl">{t("home.headline")}</h1>
            <p className="mt-5 max-w-xl text-lg text-hero-muted md:text-xl">{t("home.intro")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {session ? (
                <Link to="/profile" className={buttonVariants({ variant: "hero", size: "lg" })}>
                  {t("home.ctaProfile")} <ArrowRight />
                </Link>
              ) : (
                <Link to="/signup" className={buttonVariants({ variant: "hero", size: "lg" })}>
                  {t("home.ctaPrimary")} <ArrowRight />
                </Link>
              )}
              <Link to="/explore" className={buttonVariants({ variant: "heroOutline", size: "lg" })}>
                {t("home.ctaSecondary")}
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

      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="stages-h">
        <h2 id="stages-h" className="text-3xl font-bold text-navy">{t("home.stagesTitle")}</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            { key: "after10", icon: School, tone: "bg-teal/15 text-teal" },
            { key: "after12", icon: GraduationCap, tone: "bg-violet/15 text-violet" },
          ].map((s) => (
            <Link
              key={s.key}
              to="/explore"
              className="group flex items-start gap-4 rounded-3xl bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl", s.tone)}>
                <s.icon className="size-7" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-2xl font-bold text-navy">{t(`home.${s.key}Title`)}</span>
                  <ComingSoonBadge />
                </span>
                <span className="mt-1 block text-muted-foreground">{t(`home.${s.key}Body`)}</span>
              </span>
              <ArrowRight className="mt-2 size-6 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6" aria-labelledby="cat-h">
        <h2 id="cat-h" className="text-3xl font-bold text-navy">{t("home.categoriesTitle")}</h2>
        <p className="mt-1 text-muted-foreground">{t("home.categoriesNote")}</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => {
            const name = t(`categories.${c.slug}`);
            return (
              <li key={c.slug}>
                <Link
                  to="/explore"
                  search={{ category: c.slug }}
                  aria-label={t("home.categoryCardLabel", { name })}
                  className="flex h-full flex-col gap-3 rounded-3xl bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className={cn("flex size-12 items-center justify-center rounded-2xl", c.tone)}>
                    <c.icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="font-bold leading-snug text-navy">{name}</span>
                  <ComingSoonBadge className="mt-auto self-start" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="how-h">
        <h2 id="how-h" className="text-3xl font-bold text-navy">{t("home.howTitle")}</h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            { key: "Explore", icon: Compass, tone: "bg-primary/10 text-primary" },
            { key: "Ai", icon: Sparkles, tone: "bg-violet/15 text-violet" },
            { key: "Save", icon: BookmarkCheck, tone: "bg-amber/20 text-navy" },
          ].map((s, i) => (
            <li key={s.key} className="rounded-3xl border-2 border-dashed border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className={cn("flex size-12 items-center justify-center rounded-2xl", s.tone)}>
                  <s.icon className="size-6" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-muted px-3 py-0.5 text-xs font-bold text-muted-foreground">
                  {t("common.futureFeature")}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-navy">
                {t("common.numberedStep", { number: String(i + 1), title: t(`home.how${s.key}Title`) })}
              </h3>
              <p className="mt-1 text-muted-foreground">{t(`home.how${s.key}Body`)}</p>
            </li>
          ))}
        </ol>
      </section>

      {!session && (
        <section className="mx-auto max-w-6xl px-4">
          <div className="rounded-3xl bg-hero-gradient p-8 text-hero-foreground md:p-12">
            <h2 className="text-3xl font-bold">{t("home.ctaBandTitle")}</h2>
            <p className="mt-2 max-w-xl text-hero-muted">{t("home.ctaBandBody")}</p>
            <Link to="/signup" className={buttonVariants({ variant: "hero", size: "lg", className: "mt-6" })}>
              {t("home.ctaPrimary")}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

