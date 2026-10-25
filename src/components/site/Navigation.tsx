import { Link } from "@tanstack/react-router";
import { BookOpenCheck, Compass, Home, Sparkles, UserRound } from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { BrandLink } from "./Brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { buttonVariants } from "@/components/ui/button";

const items = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/explore", key: "nav.explore", icon: Compass },
  { to: "/exams", key: "nav.exams", icon: BookOpenCheck },
  { to: "/ai-guide", key: "nav.aiGuide", icon: Sparkles },
  { to: "/profile", key: "nav.profile", icon: UserRound },
] as const;

export function SiteHeader() {
  const { t } = useI18n();
  const { session } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <BrandLink />
        <nav aria-label={t("nav.mainLabel")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((i) => (
              <li key={i.to}>
                <Link
                  to={i.to}
                  activeOptions={{ exact: i.to === "/" }}
                  className="rounded-xl px-3 py-2 font-bold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
                >
                  {t(i.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {!session && (
            <span className="hidden sm:block">
            <Link to="/login" className={buttonVariants({ size: "sm", variant: "outline" })}>
              {t("nav.login")}
            </Link>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { t } = useI18n();
  return (
    <nav aria-label={t("nav.mobileLabel")} className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map((i) => (
          <li key={i.to}>
            <Link
              to={i.to}
              activeOptions={{ exact: i.to === "/" }}
              className="flex flex-col items-center gap-0.5 px-1 py-2 text-xs font-bold text-muted-foreground data-[status=active]:text-primary"
            >
              <i.icon className="size-6" aria-hidden="true" />
              <span className="max-w-full break-words text-center leading-snug">{t(i.key)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-border bg-card pb-24 lg:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p className="font-bold text-foreground">{t("footer.tagline")}</p>
        <p>{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}

