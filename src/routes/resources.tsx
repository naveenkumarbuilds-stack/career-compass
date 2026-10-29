import { createFileRoute } from "@tanstack/react-router";
import { FileText, Info } from "lucide-react";
import { pageMeta } from "@/i18n";
import { dataDisclaimer } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/resources")({
  head: () => pageMeta("meta.resourcesTitle", "meta.resourcesDescription"),
  component: Resources,
});

function Resources() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-navy md:text-5xl">Resources</h1>
        <p className="mt-3 text-lg text-muted-foreground">Helpful guidance and important notes for using CareerCompass.</p>
      </header>

      <div className="grid gap-6">
        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-navy">
              <Info className="size-5" /> Content Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Much of the career, exam and guidance content in this app comes from a draft dataset. It is <span className="font-semibold">not verified against official sources</span>.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{dataDisclaimer}</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-navy">
              <FileText className="size-5" /> Tips for Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-muted-foreground">
              <li>• Choose based on interest first, then marks and entry rules.</li>
              <li>• Talk to seniors and working professionals before deciding.</li>
              <li>• Always check official websites for exam dates, eligibility, fees and updates.</li>
              <li>• A career path can have multiple routes — don't feel locked in.</li>
              <li>• Skills and projects often matter as much as degrees in many fields.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
