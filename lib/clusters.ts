export type Cluster = {
  slug: string;
  code: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  name: string;
  eyebrow: string;
  description: string;
  approach: string;
  color: string;
  priority: 1 | 2 | 3;
  months: string;
  approxMonthlyVolume: number;
  kdRange: [number, number];
};

export const clusters: Cluster[] = [
  {
    slug: "fawatir-alkahraba",
    code: "A",
    name: "فواتير الكهرباء",
    eyebrow: "العنقود A",
    description: "الاستعلام عن الفاتورة وتسجيل القراءة وسدادها لكل شركة توزيع كهرباء في مصر.",
    approach: "صفحة ركيزة شاملة، ثم صفحة دليل لكل شركة توزيع، ثم صفحات مهام دقيقة (دفع، قراءة، استعلام) لكل جمهور بحث محدد.",
    color: "#b5892b",
    priority: 1,
    months: "١–٢",
    approxMonthlyVolume: 300000,
    kdRange: [0, 29],
  },
  {
    slug: "bawabat-misr-alraqmeya",
    code: "B",
    name: "بوابة مصر الرقمية والخدمات الحكومية",
    eyebrow: "العنقود B",
    description: "التسجيل والخدمات والدعم الفني لبوابة مصر الرقمية وبوابة الحكومة الإلكترونية.",
    approach: "أضخم فرصة في الخطة كلها: صفحة ركيزة لكلمة بحجم نصف مليون بحث، تليها صفحات لكل خدمة فرعية (تموين، مواليد، إسكان، رقم قومي، دعم فني).",
    color: "#1f6f5c",
    priority: 1,
    months: "٢–٣",
    approxMonthlyVolume: 600000,
    kdRange: [0, 31],
  },
  {
    slug: "rokhas-alqiyada-walmoror",
    code: "C",
    name: "رخص القيادة والمرور",
    eyebrow: "العنقود C",
    description: "تجديد رخصة القيادة والسيارة، حجز المواعيد، الرسوم، والاستعلام عن المخالفات.",
    approach: "أسهل انتصار في القائمة — صعوبة صفر في معظم الكلمات لأن المحتوى المنافس ضعيف أو قديم.",
    color: "#2b5fa8",
    priority: 2,
    months: "٣",
    approxMonthlyVolume: 35000,
    kdRange: [0, 8],
  },
  {
    slug: "hemayat-almustahlik",
    code: "D",
    name: "حماية المستهلك",
    eyebrow: "العنقود D",
    description: "أرقام التواصل، تقديم الشكاوى ومتابعتها، والحقوق القانونية للمستهلك في مصر.",
    approach: "صفحة أرقام ودليل شكاوى واضح يسبق كل منافس يكتفي بنسخ نص القانون.",
    color: "#7a3fa0",
    priority: 2,
    months: "٤",
    approxMonthlyVolume: 60000,
    kdRange: [0, 29],
  },
  {
    slug: "almahafez-alelectroneya",
    code: "E",
    name: "المحافظ الإلكترونية",
    eyebrow: "العنقود E",
    description: "إلغاء وإدارة محافظ فودافون كاش وأورانج موني وإتصالات كاش وبنك مصر ومقارنتها.",
    approach: "كلمات إجرائية محددة (إلغاء، أكواد، إدارة) بصعوبة منخفضة ونية بحث واضحة.",
    color: "#c24a3d",
    priority: 3,
    months: "٥",
    approxMonthlyVolume: 30000,
    kdRange: [0, 33],
  },
  {
    slug: "oqoud-alijar",
    code: "F",
    name: "عقود الإيجار",
    eyebrow: "العنقود F",
    description: "نماذج عقود الإيجار الجاهزة، القانون الجديد، والتوثيق الرسمي.",
    approach: "نماذج قابلة للتنزيل ومراجعة قانونية مبسطة بدل نسخ نص القانون كاملاً.",
    color: "#2f7a7a",
    priority: 3,
    months: "٥",
    approxMonthlyVolume: 26000,
    kdRange: [0, 32],
  },
  {
    slug: "shehadat-almilad-walsijil-almadani",
    code: "G",
    name: "شهادة الميلاد والسجل المدني",
    eyebrow: "العنقود G",
    description: "استخراج شهادة الميلاد كمبيوتر فوري، ماكينات السجل المدني الذكي، والاستعلام بالاسم.",
    approach: "محتوى إضافي للشهر السادس، إلى جانب توسيع العناقيد الأنجح وتحديث المقالات في المراكز ٤–٢٠.",
    color: "#8a6d1f",
    priority: 3,
    months: "٦",
    approxMonthlyVolume: 14000,
    kdRange: [0, 30],
  },
];

export function getCluster(slug: string) {
  return clusters.find((cluster) => cluster.slug === slug);
}
