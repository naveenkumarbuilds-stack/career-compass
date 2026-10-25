import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { pageMeta } from "@/i18n";
import { ComingSoonPage } from "@/components/site/ComingSoonPage";

export const Route = createFileRoute("/ai-guide")({
  head: () => pageMeta("meta.aiTitle", "meta.aiDescription"),
  component: () => <ComingSoonPage icon={Sparkles} titleKey="comingSoon.aiTitle" bodyKey="comingSoon.aiBody" />,
});

