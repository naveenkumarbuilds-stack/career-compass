import { BookOpen, GraduationCap, Rocket, Flag, Check, ArrowDown, Download } from "lucide-react";
export function RoadmapJourney({
  career,
  completed,
  toggle,
}: {
  career: any;
  completed: string[];
  toggle: (step: string) => void;
}) {
  const count = career.path.filter((s: string) => completed.includes(s)).length;
  const icons = [BookOpen, GraduationCap, Rocket, Flag];
  return (
    <div className="mt-6 overflow-hidden rounded-[2rem] border border-indigo-100 bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 px-6 py-9 text-white md:px-10">
        <div className="absolute -right-8 -top-8 size-52 rounded-full border-[24px] border-white/5" />
        <p className="relative text-xs font-bold uppercase tracking-[.25em] text-indigo-200">
          A little progress. A bigger future.
        </p>
        <h3 className="relative mt-3 max-w-xl text-3xl font-extrabold md:text-4xl">
          Your path to
          <br />
          <span className="text-teal-200">{career.title}</span>
        </h3>
        <p className="relative mt-4 max-w-xl text-sm leading-relaxed text-indigo-100">
          {career.summary}
        </p>
        <div className="relative mt-6 flex flex-wrap items-center gap-4">
          <a
            href={`/roadmaps/${career.slug}.pdf`}
            download
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-950 shadow-lg"
          >
            <Download className="size-4" aria-hidden="true" />↓ Download roadmap PDF
          </a>
          <span className="text-sm text-indigo-100" role="status">
            {count} of {career.path.length} milestones completed
          </span>
        </div>
        <progress
          aria-label="Career pathway progress"
          className="relative mt-6 h-2 w-full accent-teal-300"
          max={career.path.length}
          value={count}
        />
      </div>
      <ol className="relative mx-auto max-w-3xl space-y-0 px-5 py-8 md:px-10">
        {career.path.map((step: string, index: number) => {
          const Icon = icons[Math.min(index, icons.length - 1)]!;
          const done = completed.includes(step);
          return (
            <li key={step} className="relative pl-14 pb-8 last:pb-0 md:pl-20">
              {index < career.path.length - 1 && (
                <div className="absolute bottom-0 left-5 top-12 w-px bg-indigo-200 md:left-7" />
              )}
              <div
                className={`absolute left-0 top-2 flex size-10 items-center justify-center rounded-2xl shadow-sm md:size-14 ${done ? "bg-teal-500 text-white" : "border border-indigo-100 bg-white text-indigo-600"}`}
              >
                {done ? <Check className="size-6" /> : <Icon className="size-6" />}
              </div>
              <div
                className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6 ${done ? "border-teal-200" : "border-slate-200"}`}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-500">
                    Milestone {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-bold ${done ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {done ? "Completed" : "Your next step"}
                  </span>
                </div>
                <p className="text-base font-semibold leading-relaxed text-slate-800">{step}</p>
                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggle(step)}
                    className="size-4 accent-teal-600"
                  />
                  <span>{done ? "Completed" : "Mark as completed"}</span>
                </label>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mx-5 mb-6 flex items-center gap-3 rounded-2xl bg-teal-50 p-5 text-teal-900 md:mx-10">
        <Flag className="size-6 shrink-0" />
        <p className="text-sm">
          <strong>Your future starts with the next step.</strong>
          <br />
          Explore, practise and build experience at your own pace.
        </p>
      </div>
    </div>
  );
}
export function JourneyIllustration() {
  return (
    <svg viewBox="0 0 280 170" aria-hidden="true" className="h-36 w-60 shrink-0">
      <circle cx="140" cy="85" r="75" fill="#eef2ff" />
      <path
        d="M35 140 C35 85 110 155 115 95 S190 115 210 45"
        fill="none"
        stroke="#a5b4fc"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M35 140 C35 85 110 155 115 95 S190 115 210 45"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="5 6"
      />
      {[
        [35, 140],
        [115, 95],
        [210, 45],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="15" fill={i === 2 ? "#14b8a6" : "#6366f1"} />
          <text x={x} y={y! + 5} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">
            {i + 1}
          </text>
        </g>
      ))}
      <path d="M210 30V9l25 9-25 8" fill="#fb923c" stroke="#fb923c" strokeWidth="3" />
      <circle cx="64" cy="43" r="5" fill="#fbbf24" />
      <circle cx="241" cy="111" r="6" fill="#99f6e4" />
    </svg>
  );
}
