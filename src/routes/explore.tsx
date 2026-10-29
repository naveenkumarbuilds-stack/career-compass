import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { pageMeta, useI18n } from "@/i18n";
import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import { ComingSoonPage } from "@/components/site/ComingSoonPage";

export const Route = createFileRoute("/explore")({
  validateSearch: (s: Record<string, unknown>): { category?: CategorySlug } =>
    CATEGORY_SLUGS.includes(s.category as CategorySlug) ? { category: s.category as CategorySlug } : {},
  head: () => pageMeta("meta.exploreTitle", "meta.exploreDescription"),
  component: Explore,
});

function Explore() {
  const { category } = Route.useSearch();
  const { t } = useI18n();
  return (
    <ComingSoonPage
      icon={Compass}
      titleKey="comingSoon.exploreTitle"
      bodyKey="comingSoon.exploreBody"
      extra={category ? t("comingSoon.selectedCategory", { name: t(`categories.${category}`) }) : undefined}
    />
  );
}
