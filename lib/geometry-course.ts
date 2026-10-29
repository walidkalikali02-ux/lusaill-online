import data from "./geometry-course.json";
export type GeometryDiagramKind = "solids" | "vertices" | "rectangular" | "cubes" | "fraction-cubes" | "fractional" | "tank" | "rate" | "triangular" | "tent";
export type GeometryExercise = { prompt: string; answer: string; explanation: string; calculation: string | null; result: string | null };
export type GeometryQuiz = { question: string; choices: string[]; correctIndex: number; explanation: string };
export type GeometryLesson = {
 slug: string; order: number; title: string; shortTitle: string; description: string; minutes: number;
 diagram: GeometryDiagramKind; objectives: string[]; intro: string; formula: string;
 sections: {title: string; paragraphs: string[]}[];
 examples: {problem:string;steps:string[];answer:string;calculation:string|null;result:string|null}[];
 mistakes: string[]; quiz: GeometryQuiz; worksheet: GeometryExercise[]; reference: string;
};
export const geometryMeta = data.meta;
export const geometryLessons = data.lessons as GeometryLesson[];
export const geometryPath = "/courses/3d-figures-volumes";
export const geometryMinutes = geometryLessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
export function getGeometryLesson(slug: string) { return geometryLessons.find(lesson => lesson.slug === slug); }
export function geometryLessonPath(slug: string) { return `${geometryPath}/${slug}`; }
