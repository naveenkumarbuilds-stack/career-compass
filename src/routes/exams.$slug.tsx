import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import { pageMeta } from "@/i18n";
import { getExamBySlug } from "@/data";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/exams/$slug")({
  head: () => pageMeta("meta.examsTitle", "meta.examsDescription"),
  component: ExamDetail,
});

function ExamDetail() {
  const { slug } = Route.useParams();
  const exam: any = getExamBySlug(slug);

  if (!exam) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">Exam not found</h1>
        <p className="mt-2 text-muted-foreground">
          The exam you're looking for doesn't exist in the current data.
        </p>
        <div className="mt-6">
          <Link to="/exams" className={buttonVariants({ variant: "outline" })}>
            <ArrowLeft /> Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <Link
          to="/exams"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Exam Directory
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-navy md:text-5xl">{exam.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">Conducted by: {exam.conducted_by}</p>
      </header>

      <div className="grid gap-6">
        <section className="rounded-3xl bg-card p-6 shadow-card">
          <h2 className="text-2xl font-bold text-navy">Purpose</h2>
          <p className="mt-2 text-muted-foreground">{exam.purpose}</p>
        </section>

        <section className="rounded-3xl bg-card p-6 shadow-card">
          <h2 className="text-2xl font-bold text-navy">Eligibility (summary)</h2>
          <p className="mt-2 text-muted-foreground">{exam.eligibility_summary}</p>
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              Current eligibility, dates, application process and fees change often. Always confirm
              on the official website before applying.
            </span>
          </div>
        </section>

        {Array.isArray(exam.stages) && exam.stages.length > 0 && (
          <section className="rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-2xl font-bold text-navy">Relevant education stage</h2>
            <p className="mt-2 text-muted-foreground">
              {exam.stages
                .map((s: string) => (s === "after_10th" ? "After 10th" : "After 12th"))
                .join(", ")}
            </p>
          </section>
        )}

        <section className="rounded-3xl bg-card p-6 shadow-card">
          <h2 className="text-2xl font-bold text-navy">Official information</h2>
          <p className="mt-2 text-muted-foreground">
            For the most accurate and up-to-date information, visit the official website.
          </p>
          {exam.official_url && (
            <div className="mt-4">
              <a
                href={exam.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants()}
              >
                Visit Official Website <ExternalLink className="ml-2 size-4" />
              </a>
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-2">
          <Link to="/careers" className={buttonVariants({ variant: "outline" })}>
            Explore Related Careers
          </Link>
          <Link to="/exams" className={buttonVariants({ variant: "ghost" })}>
            Back to Exam Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
