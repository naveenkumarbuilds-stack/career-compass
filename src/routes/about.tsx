import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { pageMeta } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => pageMeta("meta.aboutTitle", "meta.aboutDescription"),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Compass className="size-10 text-primary" />
          <h1 className="text-4xl font-extrabold text-navy md:text-5xl">About CareerCompass</h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">Helping Indian students explore education and career opportunities after Class 10 and Class 12.</p>
      </header>

      <div className="grid gap-6">
        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="text-xl text-navy">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              CareerCompass aims to make career exploration accessible, interactive, and student-friendly. We help students understand streams, courses, careers, entrance exams, and pathways so they can make informed choices based on their interests and strengths.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-card">
          <CardHeader>
            <CardTitle className="text-xl text-navy">Who We Serve</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-muted-foreground">
              <li>• Students after Class 10</li>
              <li>• Science students (PCM, PCB, PCMB)</li>
              <li>• Commerce students</li>
              <li>• Arts/Humanities students</li>
              <li>• Students considering Polytechnic, ITI and vocational education</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
