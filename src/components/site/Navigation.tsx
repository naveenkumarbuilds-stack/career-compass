import { Link } from "@tanstack/react-router";
import {
  BookOpenCheck,
  Compass,
  Home,
  UserRound,
  FileText,
  Map,
  Bookmark,
  Info,
  Mail,
  Brain,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { useAuth } from "@/lib/auth";
import { BrandLink } from "./Brand";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { buttonVariants } from "@/components/ui/button";

const items = [
  { to: "/", key: "nav.home", icon: Home },

  { to: "/careers", key: "nav.careers", icon: Compass },
  { to: "/assessment", key: "nav.assessment", icon: Brain },
  { to: "/roadmaps", key: "nav.roadmaps", icon: Map },
  { to: "/exams", key: "nav.exams", icon: BookOpenCheck },
  { to: "/saved", key: "nav.saved", icon: Bookmark },
  { to: "/resources", key: "nav.resources", icon: FileText },
  { to: "/profile", key: "nav.profile", icon: UserRound },
] as const;

export function SiteHeader() {
  const { t } = useI18n();
  const { session } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <BrandLink />
        <nav aria-label={t("nav.mainLabel")} className="hidden min-w-0 flex-1 md:block">
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-3">
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
            <Link
              to="/login"
              className={buttonVariants({
                size: "sm",
                variant: "outline",
                className: "hidden sm:inline-flex",
              })}
            >
              {t("nav.login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { t } = useI18n();
  const bottomItems = [
    { to: "/", key: "nav.home", icon: Home },

    { to: "/careers", key: "nav.careers", icon: Compass },
    { to: "/assessment", key: "nav.assessment", icon: Brain },
    { to: "/exams", key: "nav.exams", icon: BookOpenCheck },
  ] as const;
  return (
    <nav
      aria-label={t("nav.mobileLabel")}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card md:hidden"
    >
      <ul className="grid grid-cols-4">
        {bottomItems.map((i) => (
          <li key={i.to}>
            <Link
              to={i.to}
              activeOptions={{ exact: i.to === "/" }}
              className="flex flex-col items-center gap-0.5 px-1 py-2 text-xs font-bold text-muted-foreground data-[status=active]:text-primary"
            >
              <i.icon className="size-5" aria-hidden="true" />
              <span className="truncate text-[10px]">{t(i.key)}</span>
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
    <footer className="mt-16 border-t border-border bg-card pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <nav aria-label="Additional pages" className="mb-6 flex flex-wrap gap-x-5 gap-y-3">
          {items
            .filter((item) => !["/", "/careers", "/assessment", "/exams"].includes(item.to))
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-semibold hover:text-primary hover:underline"
              >
                {t(item.key)}
              </Link>
            ))}
        </nav>
        <p className="font-bold text-foreground">{t("footer.tagline")}</p>
        <p>{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}
