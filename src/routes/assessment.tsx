import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { pageMeta } from "@/i18n";
import { quiz, careers } from "@/data";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessment")({
  head: () => pageMeta("meta.assessmentTitle", "meta.assessmentDescription"),
  component: Assessment,
});

function Assessment() {
  const questions = quiz?.questions || [];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  function selectAnswer(option: any) {
    const newAnswers = [...answers];
    newAnswers[current] = option;
    setAnswers(newAnswers);
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      calculateResults();
      setShowResults(true);
    }
  }

  function prev() {
    if (current > 0) setCurrent(current - 1);
  }

  function calculateResults() {
    const tagCounts: Record<string, number> = {};
    answers.forEach((ans) => {
      if (Array.isArray(ans?.tags)) {
        ans.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    const scored = (careers as any[]).map((career) => {
      let score = 0;
      const matchedTags: string[] = [];
      if (Array.isArray(career.interests)) {
        career.interests.forEach((tag: string) => {
          if (tagCounts[tag]) {
            score += tagCounts[tag];
            matchedTags.push(tag);
          }
        });
      }
      return { career, score, matchedTags };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.filter((s) => s.score > 0).slice(0, 6);
    setResults(top);
  }

  function restart() {
    setCurrent(0);
    setAnswers([]);
    setShowResults(false);
    setResults([]);
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-navy">Interest Assessment</h1>
        <p className="mt-2 text-muted-foreground">No questions available in the current data.</p>
        <div className="mt-6">
          <Link to="/careers" className={buttonVariants({ variant: "outline" })}>
            Browse Careers
          </Link>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-navy md:text-5xl">Suggested careers based on your interests.</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            This is a guidance suggestion based on shared interests — not an AI prediction, scientifically validated match, or guaranteed recommendation.
          </p>
        </header>

        {results.length === 0 ? (
          <Card className="rounded-3xl shadow-card">
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-navy">No strong matches found</p>
              <p className="mt-1 text-muted-foreground">
                Try exploring different interests or browse all careers to discover options worth considering.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={restart} className={buttonVariants({ variant: "outline" })}>
                  <RotateCcw className="mr-2 size-4" /> Restart Assessment
                </button>
                <Link to="/careers" className={buttonVariants()}>
                  Browse All Careers
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {results.map((res, idx) => (
              <Card key={res.career.slug} className="rounded-3xl shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          #{idx + 1}
                        </span>
                        <h2 className="text-xl font-bold text-navy">{res.career.title}</h2>
                      </div>
                      <p className="mt-2 text-muted-foreground">{res.career.summary}</p>
                      {res.matchedTags.length > 0 && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          <span className="font-semibold text-navy">Shared interests:</span> {res.matchedTags.join(", ")}
                        </p>
                      )}
                    </div>
                    <Link to="/careers/$slug" params={{ slug: res.career.slug }} className={buttonVariants({ variant: "outline" })}>
                      View Career <ArrowRight />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={restart} className={buttonVariants({ variant: "outline" })}>
                <RotateCcw className="mr-2 size-4" /> Restart Assessment
              </button>
              <Link to="/careers" className={buttonVariants({ variant: "ghost" })}>
                Explore careers outside results
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-navy">Interest Assessment</h1>
        <p className="mt-1 text-muted-foreground">One question per screen. Progress indicator below.</p>
      </header>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {current + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card className="rounded-3xl shadow-card">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-navy">{q.question}</h2>
          <div className="mt-4 grid gap-3">
            {(q.options || []).map((opt: any, idx: number) => {
              const selected = answers[current]?.label === opt.label;
              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(opt)}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                    selected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 items-center justify-center rounded-full border",
                      selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                    )}
                  >
                    {selected && <CheckCircle2 className="size-3" />}
                  </span>
                  <span className="flex-1">
                    <span className="font-semibold text-navy">{opt.label}</span>
                    {opt.description && <span className="mt-1 block text-sm text-muted-foreground">{opt.description}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={prev} disabled={current === 0} className={buttonVariants({ variant: "outline", disabled: current === 0 })}>
              <ArrowLeft className="mr-2 size-4" /> Previous
            </button>
            <button onClick={next} disabled={!answers[current]} className={buttonVariants({ disabled: !answers[current] })}>
              {current === questions.length - 1 ? "See Results" : "Next"} <ArrowRight className="ml-2 size-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
