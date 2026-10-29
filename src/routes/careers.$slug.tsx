import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/site/ComingSoonPage";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/careers/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComingSoonPage icon={Compass} titleKey="comingSoon.exploreTitle" bodyKey="comingSoon.exploreBody" />;
}
