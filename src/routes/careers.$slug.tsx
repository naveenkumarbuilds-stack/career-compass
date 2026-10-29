import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getCareerBySlug, getExamsBySlugs } from "@/data";
import { buttonVariants } from "@/components/ui/button";
export const Route = createFileRoute("/careers/$slug")({ component: Detail });
function Detail() {
  const { slug } = Route.useParams();
  const career = getCareerBySlug(slug);
  const [message, setMessage] = useState("");
  function save() {
    try {
      const raw = JSON.parse(localStorage.getItem("careercompass_saved") || "[]");
      const list = Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : [];
      localStorage.setItem("careercompass_saved", JSON.stringify([...new Set([...list, slug])]));
      setMessage("Career saved. View it in Saved Careers.");
    } catch {
      setMessage("Unable to save in this browser. Please allow browser storage.");
    }
  }
  if (!career)
    return (
      <div className="p-10">
        <h1>Career not found</h1>
        <Link to="/careers">Browse careers</Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/careers">← All careers</Link>
      <h1 className="mt-5 text-4xl font-extrabold text-navy">{career.title}</h1>
      <p className="my-5 text-lg">{career.overview}</p>
      <button onClick={save} className={buttonVariants()}>
        Save career
      </button>
      <Link to="/saved" className={buttonVariants({ variant: "outline", className: "ml-3" })}>
        Saved careers
      </Link>
      <p role="status">{message}</p>
      {[
        ["Skills to develop", career.skills],
        ["Education pathway", career.path],
      ].map(([title, items]) => (
        <section key={title as string} className="mt-6 rounded-3xl bg-card p-6 shadow-card">
          <h2 className="text-2xl font-bold">{title as string}</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5">
            {(items as string[]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>
      ))}
      <section className="mt-6">
        <h2 className="text-2xl font-bold">Related entrance exams</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {getExamsBySlugs(career.exam_slugs).map((exam: any) => (
            <Link
              key={exam.slug}
              to="/exams/$slug"
              params={{ slug: exam.slug }}
              className={buttonVariants({ variant: "outline" })}
            >
              {exam.name}
            </Link>
          ))}
          {!career.exam_slugs?.length && (
            <p className="mt-3 text-muted-foreground">
              No national entrance exam is listed for this pathway. Check the training provider or
              state admission process.
            </p>
          )}
        </div>
      </section>
      {career.sources?.length > 0 && (
        <section className="mt-8 rounded-3xl bg-card p-6 shadow-card">
          <h2 className="text-2xl font-bold">Official sources</h2>
          <ul className="mt-3 space-y-3">
            {career.sources.map((source: { title: string; url: string }) => (
              <li key={source.url}>
                <a
                  className="text-primary underline"
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.title} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Training summaries reference the linked publications. Confirm current admissions with
            the provider.
          </p>
        </section>
      )}
      <p className="mt-8 text-sm text-muted-foreground">
        Pathways are guidance examples. Confirm admission and professional registration requirements
        with the relevant institution.
      </p>
    </div>
  );
}
