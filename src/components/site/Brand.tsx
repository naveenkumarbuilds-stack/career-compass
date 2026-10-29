import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function CompassMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="21" className="fill-hero stroke-hero-muted" strokeWidth="3" />
      <circle cx="24" cy="24" r="15" className="fill-none stroke-hero-muted/50" strokeWidth="1.5" strokeDasharray="2 4" />
      <g className={cn(animated && "animate-needle")} style={{ transformBox: "fill-box" }}>
        <path d="M24 8 L29 24 L24 22 L19 24 Z" className="fill-coral" />
        <path d="M24 40 L19 24 L24 26 L29 24 Z" className="fill-hero-foreground" />
      </g>
      <circle cx="24" cy="24" r="2.5" className="fill-amber" />
    </svg>
  );
}

export function BrandLink() {
  const { t } = useI18n();
  return (
    <Link to="/" aria-label={t("common.logoLabel")} className="flex items-center gap-2 rounded-xl">
      <CompassMark className="size-10" />
      <span className="font-display text-2xl font-bold text-navy">{t("meta.appName")}</span>
    </Link>
  );
}

export function ReviewBadge() {
  const { lang, t } = useI18n();
  if (lang !== "kn") return null;
  return (
    <div role="note" className="bg-review text-review-foreground px-4 py-1.5 text-center text-sm font-semibold">
      ⚠ {t("common.reviewBadge")}
    </div>
  );
}

export function ComingSoonBadge({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <span className={cn("inline-flex items-center rounded-full bg-amber/15 px-3 py-0.5 text-xs font-bold text-navy", className)}>
      {t("common.comingSoon")}
    </span>
  );
}
