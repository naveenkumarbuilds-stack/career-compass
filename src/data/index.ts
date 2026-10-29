import raw from "./careercompass-content.json";
import vocationalCareers from "./vocational-careers.json";

export const careerData: any = raw;

export const meta = careerData.meta;
export const categories = careerData.categories || [];
export const stageGuides = careerData.stage_guides || {};
export const careers = [...(careerData.careers || []), ...vocationalCareers];
export const exams = careerData.exams || [];
export const quiz = {
  questions: (Array.isArray(careerData.quiz)
    ? careerData.quiz
    : careerData.quiz?.questions || []
  ).map((q: any) => ({
    ...q,
    options: q.options.map((o: any) => ({ ...o, label: o.label || o.text })),
  })),
};

export function getCareerBySlug(slug: string) {
  return careers.find((c: any) => c.slug === slug);
}

export function getCareersByCategory(categoryKey: string) {
  return careers.filter((c: any) => c.category === categoryKey);
}

export function getCareersByStage(stage: string) {
  return careers.filter((c: any) => Array.isArray(c.stages) && c.stages.includes(stage));
}

export function getExamBySlug(slug: string) {
  return exams.find((e: any) => e.slug === slug);
}

export function getExamsBySlugs(slugs: string[] = []) {
  if (!Array.isArray(slugs)) return [];
  return slugs.map((s) => getExamBySlug(s)).filter(Boolean);
}

export const dataDisclaimer =
  meta?.disclaimer || "For guidance only. Always verify from official sources.";
export const dataStatus = meta?.status || "DRAFT";
