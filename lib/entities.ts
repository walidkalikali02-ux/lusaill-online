export type Entity = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  category: string;
  url: string;
  phone?: string;
  services: string[];
  clusterCodes: string[];
};

export const entities: Entity[] = [
  {
    slug: "bawabat-misr-alraqmeya",
    name: "بوابة مصر الرقمية",
    nameEn: "Egypt Digital Portal",
    description: "البوابة الرسمية للخدمات الحكومية في مصر. توفر أكثر من ١٠٠ خدمة إلكترونية تشمل التموين، الأحوال المدنية، الإسكان، والرقم القومي.",
    category: "خدمات حكومية",
    url: "https://digital.gov.eg",
    phone: "16000",
    services: ["التسجيل في بوابة مصر الرقمية", "خدمات التموين", "استعلام بطاقة التموين", "إضافة المواليد", "خدمات الأحوال المدنية", "تحديث البيانات"],
    clusterCodes: ["B"],
  },
  {
    slug: "metrash",
    name: "تطبيق مترش",
    nameEn: "Metrash",
    description: "تطبيق وزارة الداخلية المصري للخدمات الإلكترونية. يتيح تجديد رخص القيادة والسيارة، الاستعلام عن المخالفات، وحجز المواعيد إلكترونيًا.",
    category: "خدمات المرور",
    url: "https://metrash2.gov.eg",
    phone: "16000",
    services: ["تجديد رخصة القيادة", "تجديد رخصة السيارة", "الاستعلام عن المخالفات", "حجز مواعيد المرور", "الإبلاغ عن حوادث"],
    clusterCodes: ["C"],
  },
  {
    slug: "hukoomi-misr",
    name: "بوابة الحكومة الإلكترونية",
    nameEn: "Egypt eGov Portal",
    description: "بوابة الحكومة الإلكترونية المركزية. تربط المواطنين بالخدمات الحكومية من جهات متعددة في مكان واحد.",
    category: "خدمات حكومية",
    url: "https://www.eg.gov.eg",
    services: ["الخدمات الحكومية المركزية", "طلب المستندات الرسمية", "تقديم الشكاوى", "الاستعلام عن المعاملات"],
    clusterCodes: ["B"],
  },
  {
    slug: "jihaz-hemayat-almustahlik",
    name: "جهاز حماية المستهلك",
    nameEn: "Consumer Protection Agency",
    description: "الجهاز المصري لحماية المستهلك. يوفر أرقام التواصل، دليل تقديم الشكاوى، ومتابعة حالات الاضطهاد التجاري.",
    category: "حماية المستهلك",
    url: "https://www.cpa.gov.eg",
    phone: "19588",
    services: ["تقديم شكوى مستهلك", "متابعة الشكاوى", "قناة واتساب للشكاوى", "دليل حقوق المستهلك"],
    clusterCodes: ["D"],
  },
  {
    slug: "sherkat-kahraba",
    name: "شركات توزيع الكهرباء",
    nameEn: "Electricity Distribution Companies",
    description: "دليل للوصول إلى شركات توزيع الكهرباء المصرية وخدمات الاستعلام والسداد وتسجيل القراءة عبر القنوات الرسمية لكل شركة.",
    category: "خدمات المرافق",
    url: "https://www.moee.gov.eg/test_new/serv2.aspx",
    phone: "121",
    services: ["الاستعلام عن فاتورة الكهرباء", "سداد الفواتير", "تسجيل قراءة العداد", "الشكاوى الفنية"],
    clusterCodes: ["A"],
  },
  {
    slug: "albih-almisri",
    name: "البريد المصري",
    nameEn: "Egypt Post",
    description: "جهاز البريد المصري — الخدمات المالية والبريدية. إصدار شهادات الميلاد، تحويل الأموال، مدفوعات التأمينات.",
    category: "خدمات بريدية",
    url: "https://www.egyptpost.org",
    phone: "16789",
    services: ["إصدار شهادة الميلاد", "تحويل الأموال", "مدفوعات التأمينات", "خدمات الطوابع"],
    clusterCodes: ["G"],
  },
];

export function getEntity(slug: string) {
  return entities.find((entity) => entity.slug === slug);
}
