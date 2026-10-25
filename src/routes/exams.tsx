import { createFileRoute } from "@tanstack/react-router";
import { BookOpenCheck } from "lucide-react";
import { pageMeta } from "@/i18n";
import { ComingSoonPage } from "@/components/site/ComingSoonPage";

export const Route = createFileRoute("/exams")({
  head: () => pageMeta("meta.examsTitle", "meta.examsDescription"),
  component: () => <ComingSoonPage icon={BookOpenCheck} titleKey="comingSoon.examsTitle" bodyKey="comingSoon.examsBody" />,
});

