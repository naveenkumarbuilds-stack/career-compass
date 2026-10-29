import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { pageMeta } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/contact")({
  head: () => pageMeta("meta.contactTitle", "meta.contactDescription"),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Mail className="size-10 text-primary" />
          <h1 className="text-4xl font-extrabold text-navy md:text-5xl">Contact</h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">Get in touch with CareerCompass.</p>
      </header>

      <Card className="rounded-3xl shadow-card">
        <CardHeader>
          <CardTitle className="text-xl text-navy">Reach Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            For questions, feedback, or suggestions about CareerCompass, feel free to reach out. This is a student project focused on career guidance.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: For official exam information, always refer to the respective conducting authority's official website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
