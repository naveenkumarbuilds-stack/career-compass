import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ArrowRight, ExternalLink } from "lucide-react";
import { pageMeta } from "@/i18n";
import { exams } from "@/data";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exams")({
  head: () => pageMeta("meta.examsTitle", "meta.examsDescription"),
  component: Exams,
});

function Exams() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string | undefined>();

  let list = exams as any[];
  if (stageFilter) list = list.filter((e) => Array.isArray(e.stages) && e.stages.includes(stageFilter));
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (e) =>
        e.name?.toLowerCase().includes(q) ||
        e.purpose?.toLowerCase().includes(q) ||
        e.conducted_by?.toLowerCase().includes(q)
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-navy md:text-5xl">Entrance Exam Directory</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Search entrance exams across India. Current eligibility, dates and requirements may change — always confirm on official notifications.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exams..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStageFilter(undefined)}
            className={cn(buttonVariants({ variant: stageFilter ? "outline" : "default", size: "sm" }))}
          >
            All
          </button>
          <button
            onClick={() => setStageFilter("after_10th")}
            className={cn(buttonVariants({ variant: stageFilter === "after_10th" ? "default" : "outline", size: "sm" }))}
          >
            After 10th
          </button>
          <button
            onClick={() => setStageFilter("after_12th")}
            className={cn(buttonVariants({ variant: stageFilter === "after_12th" ? "default" : "outline", size: "sm" }))}
          >
            After 12th
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-3xl bg-card p-10 text-center shadow-card">
          <p className="text-lg font-semibold text-navy">No exams found</p>
          <p className="mt-1 text-muted-foreground">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((exam) => (
            <Card key={exam.slug} className="rounded-3xl shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
              <CardHeader>
                <CardTitle className="text-xl text-navy">{exam.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Conducted by: {exam.conducted_by}
                  {Array.isArray(exam.stages) && exam.stages.length > 0 && (
                    <span className="ml-2">• {exam.stages.map((s: string) => (s === "after_10th" ? "After 10th" : "After 12th")).join(", ")}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{exam.purpose}</p>
                {exam.eligibility_summary && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-navy">Eligibility (summary):</span> {exam.eligibility_summary}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/exams/$slug" params={{ slug: exam.slug }} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    View Details <ArrowRight />
                  </Link>
                  {exam.official_url && (
                    <a href={exam.official_url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                      Official Website <ExternalLink className="ml-1 size-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
