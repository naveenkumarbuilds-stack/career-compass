import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/resources")({ component: Resources });
const resources = [
  {
    name: "SWAYAM",
    url: "https://swayam.gov.in/",
    body: "Explore courses from participating institutions. Search a subject, read the prerequisites and choose a course that fits your interests.",
  },
  {
    name: "Bharat Skills",
    url: "https://bharatskill.gov.in/",
    body: "Find vocational learning material, trade curricula, videos and practice resources. Useful when exploring ITI and practical skill pathways.",
  },
  {
    name: "National Career Service",
    url: "https://www.ncs.gov.in/",
    body: "Explore government career services, guidance and career centres. Read the official service details before registering.",
  },
];
function Resources() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-navy">Student resources</h1>
      <p className="my-4 text-lg text-muted-foreground">
        Use these resources to turn a career idea into a practical next step.
      </p>
      <div className="grid gap-5 md:grid-cols-3">
        {resources.map((r) => (
          <article key={r.url} className="rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-2xl font-bold">{r.name}</h2>
            <p className="my-4">{r.body}</p>
            <a
              className="text-primary underline"
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open official website ↗
            </a>
          </article>
        ))}
      </div>
      <section className="mt-8 rounded-3xl bg-card p-6 shadow-card">
        <h2 className="text-2xl font-bold">Before choosing a course</h2>
        <ol className="my-4 list-decimal space-y-3 pl-5">
          <li>Shortlist careers whose daily work interests you.</li>
          <li>
            Confirm subject requirements and recognition with the institution or relevant regulator.
          </li>
          <li>Ask about practical training, total costs and available support.</li>
          <li>Try a small project or introductory lesson before committing.</li>
          <li>Discuss your shortlist with a teacher, guardian or qualified counsellor.</li>
        </ol>
        <div className="flex flex-wrap gap-5">
          <Link to="/careers" className="text-primary underline">
            Explore and compare careers
          </Link>
          <Link to="/roadmaps" className="text-primary underline">
            Build a plan and download its PDF
          </Link>
        </div>
      </section>
      <p className="mt-8 text-sm text-muted-foreground">
        Our pathway summaries are guidance examples. Confirm current admissions and professional
        requirements using official sources.
      </p>
    </div>
  );
}
