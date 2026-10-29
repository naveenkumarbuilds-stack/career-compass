import { SaveCareerButton } from "@/components/site/SaveCareerButton";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { careers, categories } from "@/data";
import { buttonVariants } from "@/components/ui/button";
export const Route = createFileRoute("/careers/")({
  validateSearch: (s: Record<string, unknown>): { category?: string } => ({
    category: typeof s["category"] === "string" ? s["category"] : "",
  }),
  component: Careers,
});
export function Careers() {
  const search = Route.useSearch();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(search.category || "");
  const [stage, setStage] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const list = careers.filter(
    (c: any) =>
      (!category || c.category === category) &&
      (!stage || c.stages.includes(stage)) &&
      `${c.title} ${c.summary} ${c.skills.join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const comparison = careers.filter((c: any) => selected.includes(c.slug));
  function toggle(slug: string) {
    setSelected((old) =>
      old.includes(slug) ? old.filter((s) => s !== slug) : old.length < 3 ? [...old, slug] : old,
    );
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-navy">Explore Careers</h1>
      <p className="my-4 text-muted-foreground">
        Discover pathways, skills and entrance exams. Compare up to three careers to explore your
        options.
      </p>
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          aria-label="Search careers"
          placeholder="Search careers or skills"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-xl border p-3"
        />
        <select
          aria-label="Career category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="">All categories</option>
          {categories.map((c: any) => (
            <option key={c.key} value={c.key}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          aria-label="Education stage"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="">All education stages</option>
          <option value="after_10th">After 10th</option>
          <option value="after_12th">After 12th</option>
        </select>
        <button
          onClick={() => {
            setQuery("");
            setCategory("");
            setStage("");
          }}
          className={buttonVariants({ variant: "outline" })}
        >
          Reset filters
        </button>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Stage indicates when you can begin the listed pathway, rather than immediate eligibility to
        practise the profession.
      </p>
      <p role="status">
        {list.length} careers found · {selected.length} selected for comparison
      </p>
      <button
        disabled={selected.length < 2}
        className={buttonVariants({ className: "mt-4" })}
        onClick={() => {
          const section = document.getElementById("career-comparison");
          section?.scrollIntoView({ behavior: "smooth", block: "start" });
          section?.focus();
        }}
      >
        Compare selected careers ({selected.length})
      </button>
      {comparison.length > 0 && (
        <section
          id="career-comparison"
          tabIndex={-1}
          aria-label="Career comparison"
          className="my-6 rounded-3xl bg-card p-5 shadow-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Compare careers</h2>
            <button
              onClick={() => setSelected([])}
              className={buttonVariants({ variant: "outline" })}
            >
              Clear comparison
            </button>
          </div>
          {comparison.length === 1 && (
            <p className="mt-3">Select another career to compare pathways and skills.</p>
          )}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Education pathways and skills for selected careers
              </caption>
              <thead>
                <tr>
                  <th className="p-3">What to consider</th>
                  {comparison.map((c: any) => (
                    <th key={c.slug} className="min-w-56 p-3">
                      <Link
                        to="/careers/$slug"
                        params={{ slug: c.slug }}
                        className="text-primary underline"
                      >
                        {c.title}
                      </Link>
                      <button
                        aria-label={`Remove ${c.title} from comparison`}
                        className="ml-3"
                        onClick={() => toggle(c.slug)}
                      >
                        ×
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Daily work", "summary"],
                  ["Skills", "skills"],
                  ["Pathway", "path"],
                ].map(([label, key]) => (
                  <tr key={key} className="border-t">
                    <th scope="row" className="p-3 align-top">
                      {label}
                    </th>
                    {comparison.map((c: any) => (
                      <td key={c.slug} className="p-3 align-top">
                        {Array.isArray(c[key!]) ? (
                          <ul className="list-disc space-y-2 pl-4">
                            {c[key!].map((v: string) => (
                              <li key={v}>{v}</li>
                            ))}
                          </ul>
                        ) : (
                          c[key!]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {list.length === 0 && (
        <div className="my-6 rounded-3xl bg-card p-8">
          <h2 className="text-xl font-bold">No careers match these filters</h2>
          <p>Try another keyword, category or education stage.</p>
        </div>
      )}
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {list.map((c: any) => (
          <article key={c.slug} className="rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-2xl font-bold">{c.title}</h2>
            <p className="my-3 text-muted-foreground">{c.summary}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/careers/$slug"
                params={{ slug: c.slug }}
                className={buttonVariants({ variant: "outline" })}
              >
                View pathway
              </Link>
              <SaveCareerButton slug={c.slug} />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(c.slug)}
                  disabled={selected.length >= 3 && !selected.includes(c.slug)}
                  onChange={() => toggle(c.slug)}
                />
                Compare {c.title}
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
