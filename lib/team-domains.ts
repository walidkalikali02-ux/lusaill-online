import { articles, clusters } from "./content";
import { addedCourses, academyPath, courseIdentity } from "./academy-course";
import { geometryMeta, geometryPath } from "./geometry-course";
import { fivegMeta, fivegPath } from "./fiveg-course";
import { sixgMeta, sixgPath } from "./sixg-course";
import { courseMeta } from "./driving-course";
import { buildTeamPersonas, type TeamDomain } from "./team-personas";

// Register courses/categories in their existing catalogs; no separate staff
// record is required for a newly published field to appear on /team.
export function getTeamDomains(): TeamDomain[] {
  const published = articles.filter(article => article.status === "published");
  const guides: TeamDomain[] = clusters.filter(cluster => published.some(article => article.clusterCode === cluster.code)).map(cluster => ({ id: `guide:${cluster.slug}`, title: cluster.name, href: `/categories/${cluster.slug}`, kind: "guide" }));
  const courses: TeamDomain[] = [
    { id: "course:learn-driving", title: courseMeta.title, href: "/courses/learn-driving", kind: "course" },
    ...[{ meta: geometryMeta, path: geometryPath }, { meta: fivegMeta, path: fivegPath }, { meta: sixgMeta, path: sixgPath }].map(course => ({ id: `course:${course.path}`, title: course.meta.title, href: course.path, kind: "course" as const })),
    ...addedCourses.map(course => ({ id: `course:${course.meta.slug}`, title: courseIdentity(course).label, href: academyPath(course), kind: "course" as const })),
  ];
  return [...guides, ...courses];
}
export const getTeamPersonas = () => buildTeamPersonas(getTeamDomains());
