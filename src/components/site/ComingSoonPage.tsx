import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n";
import { buttonVariants } from "@/components/ui/button";
import { ComingSoonBadge } from "./Brand";

export function ComingSoonPage({
  icon: Icon,
  titleKey,
  bodyKey,
  extra,
}: {
  icon: LucideIcon;
  titleKey: string;
  bodyKey: string;
  extra?: string | undefined;
}) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center animate-rise">
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-accent text-indigo">
        <Icon className="size-10" aria-hidden="true" />
      </div>
      <ComingSoonBadge />
      <h1 className="mt-4 text-4xl font-bold text-navy">{t(titleKey)}</h1>
      {extra && <p className="mt-3 text-lg font-bold text-indigo">{extra}</p>}
      <p className="mt-4 text-lg text-muted-foreground">{t(bodyKey)}</p>
      <p className="mt-2 text-muted-foreground">{t("comingSoon.note")}</p>
      <Link to="/" className={buttonVariants({ className: "mt-8" })}>
        {t("common.backHome")}
      </Link>
    </section>
  );
}

