export type TeamDomain = { id: string; title: string; href: string; kind: "guide" | "course"; available?: boolean };
export const teamRoles = {
  engineer: { label: "المهندس", focus: "تبسيط النظم والأدوات والخطوات الفنية", task: "تفكيك المفاهيم الفنية إلى أمثلة وخطوات واضحة." },
  teacher: { label: "الأستاذ", focus: "الشرح وبناء مسار التعلّم", task: "ترتيب المفاهيم من الأساسيات إلى التطبيق والتمرين." },
  writer: { label: "الكاتب", focus: "الصياغة وتجربة القراءة", task: "تحويل السؤال إلى شرح مباشر بلغة عربية سهلة." },
  researcher: { label: "الباحث", focus: "البحث وتنظيم المصادر", task: "جمع أسئلة المجال وتنظيم مراجعها وحدود استخدامها." },
  editor: { label: "المدقق", focus: "الوضوح واتساق التفاصيل", task: "مراجعة المصطلحات والروابط واتساق الشرح." },
} as const;
export type TeamRole = keyof typeof teamRoles;
export type TeamPersona = TeamDomain & { name: string; role: TeamRole; seed: number; bio: string };
const firstNames = ["سليم", "ريم", "آدم", "ليان", "عمر", "سارة", "ياسين", "نور", "كريم", "هنا", "نديم", "مريم", "زياد", "دانا", "مازن", "رنا", "رامي", "لمى", "أنس", "جنى"];
const lastNames = ["مراد", "سالم", "نادر", "منصور", "رفيق", "خليل", "راشد", "فارس", "حمدان", "كامل", "صادق", "عادل", "زيدان", "سراج", "كمال", "أمين", "شاكر", "هلال", "هاشم", "نجار", "عزام", "بدر", "صفوان", "شريف", "قاسم"];
export const personaHash = (value: string) => Array.from(value).reduce((hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0, 7);
const assignedRoles: Record<string, TeamRole> = {
  "guide:fawatir-alkahraba": "engineer", "guide:digital-life": "writer",
  "guide:bawabat-misr-alraqmeya": "researcher", "guide:hemayat-almustahlik": "editor",
  "guide:shehadat-almilad-walsijil-almadani": "writer", "guide:rokhas-alqiyada-walmoror": "researcher",
  "course:abbreviations": "editor", "course:accounting-basics": "researcher", "course:marketing-communications": "writer",
};
function roleFor(domain: TeamDomain): TeamRole {
  if (assignedRoles[domain.id]) return assignedRoles[domain.id];
  if (/هندس|اتصالات|5G|6G|ذكاء|برمج|Python|خوارزم|AJAX/i.test(domain.title)) return "engineer";
  if (domain.kind === "course") return "teacher";
  return (Object.keys(teamRoles) as TeamRole[])[personaHash(domain.id) % 5];
}

// Every registered domain gets a persona, including future domains. These are
// fictional editorial characters, never Article authors or human reviewers.
export function buildTeamPersonas(domains: readonly TeamDomain[]): TeamPersona[] {
  return domains.map(domain => {
    const seed = personaHash(domain.id);
    const role = roleFor(domain);
    const name = `${firstNames[seed % firstNames.length]} ${lastNames[Math.floor(seed / firstNames.length) % lastNames.length]}`;
    return { ...domain, seed, role, name, bio: `مجال الاهتمام: ${domain.title}. ${teamRoles[role].task}` };
  });
}

/** Stable anchor for a subject directory card; not a byline or human author ID. */
export function teamPersonaAnchor(persona: Pick<TeamPersona, "id">): string {
  return "team-" + persona.id.replace(/[^a-z0-9-]+/gi, "-");
}
