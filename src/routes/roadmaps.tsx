import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, School, GraduationCap, Briefcase } from "lucide-react";
import { pageMeta } from "@/i18n";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/roadmaps")({
  head: () => pageMeta("meta.roadmapsTitle", "meta.roadmapsDescription"),
  component: Roadmaps,
});

function Roadmaps() {
  const roadmaps = [
    {
      title: "Software Development",
      path: [
        { icon: School, label: "Class 10", desc: "Choose Science (PCM) or any stream with interest in computers" },
        { icon: GraduationCap, label: "Class 11-12", desc: "PCM with Computer Science preferred" },
        { icon: GraduationCap, label: "UG", desc: "B.Tech/B.E. in CS/IT or related (via JEE/other entrances)" },
        { icon: Briefcase, label: "Career", desc: "Software Developer / Engineer" },
      ],
    },
    {
      title: "Chartered Accountancy (CA)",
      path: [
        { icon: School, label: "Class 10", desc: "Any stream (Commerce helpful)" },
        { icon: GraduationCap, label: "Class 11-12", desc: "Commerce stream recommended" },
        { icon: GraduationCap, label: "CA Foundation", desc: "Register with ICAI and clear Foundation" },
        { icon: Briefcase, label: "Career", desc: "Chartered Accountant" },
      ],
    },
    {
      title: "Medicine (MBBS)",
      path: [
        { icon: School, label: "Class 10", desc: "Focus on Science" },
        { icon: GraduationCap, label: "Class 11-12", desc: "PCB (PCMB also possible)" },
        { icon: GraduationCap, label: "NEET", desc: "Clear NEET for MBBS/BDS" },
        { icon: Briefcase, label: "Career", desc: "Doctor (MBBS) / Specialist later" },
      ],
    },
    {
      title: "Banking & Finance",
      path: [
        { icon: School, label: "Class 10", desc: "Any stream" },
        { icon: GraduationCap, label: "Class 11-12", desc: "Commerce preferred" },
        { icon: GraduationCap, label: "UG", desc: "B.Com/BBA/Economics (or other)" },
        { icon: Briefcase, label: "Career", desc: "Banking/Finance Professional (via exams or campus)" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-navy md:text-5xl">Interactive Career Roadmaps</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Visualize possible pathways from Class 10 to your chosen career. These are illustrative examples — multiple routes exist and requirements may vary.
        </p>
      </header>

      <div className="grid gap-6">
        {roadmaps.map((roadmap, idx) => (
          <section key={idx} className="rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-2xl font-bold text-navy">{roadmap.title}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {roadmap.path.map((step, i) => (
                <div key={i} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <step.icon className="size-7" aria-hidden="true" />
                    </div>
                    <div className="mt-3 font-semibold text-navy">{step.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{step.desc}</div>
                  </div>
                  {i < roadmap.path.length - 1 && (
                    <div className="absolute right-0 top-7 hidden w-1/2 -translate-x-1/2 md:block">
                      <ArrowRight className="mx-auto size-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/careers" className={buttonVariants({ variant: "outline" })}>
                Explore related careers <ArrowRight />
              </Link>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/careers" className={buttonVariants({ size: "lg" })}>
          Browse All Careers
        </Link>
        <Link to="/exams" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Check Entrance Exams
        </Link>
      </div>
    </div>
  );
}
