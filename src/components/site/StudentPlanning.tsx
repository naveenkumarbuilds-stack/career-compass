import { RoadmapJourney, JourneyIllustration } from "@/components/site/RoadmapJourney";
import { matchesCareer } from "@/lib/career-search";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { careers, getCareerBySlug } from "@/data";
import {
  readHistory,
  readProgress,
  readBookmarks,
  HISTORY_KEY,
  PROGRESS_KEY,
  type AssessmentRecord,
} from "@/lib/planning";
import { buttonVariants } from "@/components/ui/button";
export function AssessmentHistory() {
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const refresh = () => setHistory(readHistory());
    refresh();
    window.addEventListener("careercompass-planning", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("careercompass-planning", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return (
    <section className="my-8 rounded-3xl bg-card p-6 shadow-card">
      <h2 className="text-2xl font-bold text-navy">Your assessment history</h2>
      <p className="my-3 text-sm text-muted-foreground">
        Stored in this browser. Keep up to 20 recent results to explore how your interests develop.
      </p>
      {history.length === 0 ? (
        <p>No completed assessments yet.</p>
      ) : (
        <>
          <ol className="relative ml-4 border-l-2 border-primary/20 py-2">
            {history.map((record) => (
              <li key={record.id} className="border-t pt-3">
                <p className="font-semibold">{new Date(record.completedAt).toLocaleString()}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {record.slugs.map((slug) => {
                    const c = getCareerBySlug(slug);
                    return c ? (
                      <Link
                        key={slug}
                        to="/careers/$slug"
                        params={{ slug }}
                        className="text-primary underline"
                      >
                        {c.title}
                      </Link>
                    ) : null;
                  })}
                </div>
              </li>
            ))}
          </ol>
          <button
            className={buttonVariants({ variant: "outline", className: "mt-4" })}
            onClick={() => {
              try {
                localStorage.removeItem(HISTORY_KEY);
                setHistory([]);
              } catch {
                setError("Unable to clear history in this browser.");
              }
            }}
          >
            Clear assessment history
          </button>
        </>
      )}
      <p role="status">{error}</p>
    </section>
  );
}
export function PersonalRoadmaps() {
  const [slug, setSlug] = useState("");
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searched, setSearched] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [progress, setProgress] = useState<Record<string, string[]>>({});
  const [saved, setSaved] = useState<string[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    setProgress(readProgress());
    setSaved(readBookmarks());
  }, []);
  const career = getCareerBySlug(slug);
  const completed = progress[slug] || [];
  function toggle(step: string) {
    const next = {
      ...progress,
      [slug]: completed.includes(step) ? completed.filter((s) => s !== step) : [...completed, step],
    };
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      setProgress(next);
      setError("Progress saved in this browser.");
    } catch {
      setError("Unable to save progress. Please allow browser storage.");
    }
  }
  return (
    <section className="mb-8 rounded-3xl bg-card p-6 shadow-card">
      <div className="float-right hidden md:block">
        <JourneyIllustration />
      </div>
      <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-primary">
        Your next chapter
      </p>
      <h2 className="text-3xl font-extrabold text-navy">Build your career roadmap</h2>
      <p className="my-3 text-muted-foreground">
        Choose a career and track the pathway steps you complete. Progress stays in this browser.
      </p>
      <label htmlFor="roadmap-search" className="block font-semibold">
        Search career roadmaps
      </label>
      <form
        className="my-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const matches = careers.filter((c: any) => matchesCareer(c.title, query));
          setSuggestionsOpen(false);
          setSearchTerm(query);
          setSearched(true);
          setSlug(matches[0]?.slug || "");
        }}
      >
        <input
          id="roadmap-search"
          className="min-w-0 flex-1 rounded-xl border bg-card p-3"
          placeholder="Try software, teacher or fitter"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSuggestionsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSuggestionsOpen(false);
          }}
          aria-describedby="roadmap-search-help"
        />
        <button type="submit" className={buttonVariants()}>
          Search
        </button>
      </form>
      <p id="roadmap-search-help" className="mb-3 text-sm text-muted-foreground">
        Type a career name and choose a suggestion, or press Enter to search.
      </p>
      {suggestionsOpen && query.trim() && (
        <div
          aria-label="Career suggestions"
          className="mb-4 overflow-hidden rounded-2xl border bg-card shadow-lg"
        >
          {careers
            .filter((c: any) => matchesCareer(c.title, query))
            .slice(0, 6)
            .map((c: any) => (
              <button
                type="button"
                key={c.slug}
                className="flex w-full items-center justify-between border-b px-4 py-3 text-left font-semibold last:border-0 hover:bg-primary/5 focus-visible:bg-primary/10"
                onClick={() => {
                  setSlug(c.slug);
                  setQuery(c.title);
                  setSearchTerm(c.title);
                  setSearched(true);
                  setSuggestionsOpen(false);
                }}
              >
                {c.title}
                <span aria-hidden="true" className="text-primary">
                  View roadmap →
                </span>
              </button>
            ))}
          {!careers.some((c: any) => matchesCareer(c.title, query)) && (
            <p className="p-4 text-muted-foreground">No matching career. Try a different name.</p>
          )}
        </div>
      )}
      {searched && (
        <p role="status" className="mb-3 text-sm">
          {careers.filter((c: any) => matchesCareer(c.title, searchTerm)).length} matching roadmaps.
          Choose a career below.
        </p>
      )}
      <Link to="/careers" className={buttonVariants({ variant: "outline", className: "mb-4" })}>
        Compare 2–3 careers side by side →
      </Link>
      <label htmlFor="plan-career" className="block font-semibold">
        Career to plan
      </label>
      <select
        id="plan-career"
        className="my-3 w-full rounded-xl border bg-card p-3"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      >
        <option value="">Choose a career</option>
        {careers
          .filter((c: any) => c.slug === slug || matchesCareer(c.title, searchTerm))
          .map((c: any) => (
            <option key={c.slug} value={c.slug}>
              {saved.includes(c.slug) ? "★ " : ""}
              {c.title}
            </option>
          ))}
      </select>
      {career && (
        <>
          <RoadmapJourney career={career} completed={completed} toggle={toggle} />
          <Link
            className="mt-5 inline-block text-primary underline"
            to="/careers/$slug"
            params={{ slug }}
          >
            View career and related exams →
          </Link>
        </>
      )}
      <p role="status" className="mt-3 text-sm">
        {error}
      </p>
    </section>
  );
}
