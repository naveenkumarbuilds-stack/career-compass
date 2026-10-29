import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";
import { pageMeta } from "@/i18n";
import { getCareerBySlug } from "@/data";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/saved")({
  head: () => pageMeta("meta.savedTitle", "meta.savedDescription"),
  component: Saved,
});

function Saved() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("careercompass_saved");
      if (raw) setSaved(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  function remove(slug: string) {
    const next = saved.filter((s) => s !== slug);
    setSaved(next);
    try {
      localStorage.setItem("careercompass_saved", JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  }

  const savedCareers = saved.map((slug) => getCareerBySlug(slug)).filter(Boolean) as any[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-navy md:text-5xl">Saved Careers</h1>
        <p className="mt-3 text-lg text-muted-foreground">Your bookmarked careers stored locally in this browser.</p>
      </header>

      {savedCareers.length === 0 ? (
        <Card className="rounded-3xl shadow-card">
          <CardContent className="p-10 text-center">
            <Bookmark className="mx-auto size-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold text-navy">No saved careers yet</p>
            <p className="mt-1 text-muted-foreground">Browse careers and save ones you're interested in.</p>
            <div className="mt-6">
              <Link to="/careers" className={buttonVariants()}>
                Browse Careers <ArrowRight />
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedCareers.map((career) => (
            <Card key={career.slug} className="rounded-3xl shadow-card">
              <CardHeader>
                <CardTitle className="text-xl text-navy">{career.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{career.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/careers/$slug" params={{ slug: career.slug }} className={buttonVariants({ variant: "outline" })}>
                    View Details <ArrowRight />
                  </Link>
                  <button onClick={() => remove(career.slug)} className={buttonVariants({ variant: "ghost" })}>
                    <Trash2 className="mr-2 size-4" /> Remove
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
