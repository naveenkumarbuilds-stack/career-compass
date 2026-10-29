import { createFileRoute, Link } from "@tanstack/react-router";
import { pageMeta } from "@/i18n";
import { ComingSoonPage } from "@/components/site/ComingSoonPage";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => pageMeta("meta.careersTitle", "meta.careersDescription"),
  component: Careers,
});

function Careers() {
  return <ComingSoonPage icon={Compass} titleKey="comingSoon.exploreTitle" bodyKey="comingSoon.exploreBody" />;
}
