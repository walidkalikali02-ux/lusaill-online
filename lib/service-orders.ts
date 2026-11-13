export type AnswerMap = Record<string, string>;
type Question = { id: string; label: string; options?: string[]; hint?: string; optional?: boolean; email?: boolean; when?: [string, string] };
type Service = { slug: string; name: string; description: string; price?: string; questions: Question[] };

export const services: Service[] = [
  {
    slug: "website-design", name: "إنشاء المواقع", description: "مواقع للشركات والمتاجر والملفات التعريفية، وتصميم جديد لموقعك الحالي.", price: "500 ر.ق شهريًا",
    questions: [
      { id: "type", label: "أي نوع من المواقع تحتاج؟", options: ["موقع تعريفي", "متجر إلكتروني", "صفحة هبوط", "إعادة تصميم موقع قائم", "نوع آخر"] },
      { id: "current", label: "ما رابط الموقع الحالي؟", when: ["type", "إعادة تصميم موقع قائم"] },
      { id: "business", label: "ما اسم النشاط، وماذا يقدم، ومن الجمهور الذي تريد الوصول إليه؟" },
      { id: "goal", label: "ما الهدف الأساسي للموقع؟", hint: "مثلاً طلب عرض سعر، بيع منتجات، حجز مواعيد، أو عرض الأعمال." },
      { id: "pages", label: "ما الصفحات واللغات والوظائف المطلوبة؟", hint: "مثلاً صفحة خدمات بالعربية والإنجليزية، دفع إلكتروني أو نموذج حجز." },
      { id: "assets", label: "ما المواد المتوفرة لديك؟", hint: "اذكر الشعار والنصوص والصور والنطاق والاستضافة، وأضف أمثلة للتصميم إن وجدت." },
    ],
  },
  {
    slug: "video-editing", name: "مونتاج الفيديو", description: "تحرير المقاطع وإعداد النسخ المناسبة لمنصات النشر، مع الترجمة أو العناوين عند الحاجة.",
    questions: [
      { id: "type", label: "ما نوع الفيديو؟", options: ["فيديو قصير للسوشيال", "إعلان", "فيديو يوتيوب", "فيديو تعليمي", "نوع آخر"] },
      { id: "purpose", label: "ما موضوع الفيديو والرسالة والجمهور المستهدف؟" },
      { id: "footage", label: "هل المقاطع الأصلية جاهزة؟", options: ["نعم", "بعض المقاطع جاهزة", "لا، أحتاج المساعدة في تحديد المواد"] },
      { id: "footage-link", label: "أرسل رابط المقاطع المتاحة أو اذكر عددها ومدتها.", when: ["footage", "نعم"] },
      { id: "output", label: "أين سيُنشر الفيديو؟ وما المدة وعدد النسخ والمقاسات المطلوبة؟" },
      { id: "style", label: "ما أسلوب المونتاج المطلوب؟ وهل تحتاج ترجمة، عناوين، موسيقى أو تعليقًا صوتيًا؟", hint: "يمكنك إضافة رابط لفيديو مرجعي." },
    ],
  },
  {
    slug: "excel", name: "إنشاء وتعديل ملفات إكسل", description: "قوالب وتقارير ومعادلات ولوحات متابعة، أو إصلاح ملف موجود وتطويره.",
    questions: [
      { id: "type", label: "هل تريد إنشاء ملف جديد أم تعديل ملف موجود؟", options: ["إنشاء ملف جديد", "تعديل ملف موجود", "تنظيف بيانات وتحليلها"] },
      { id: "current", label: "ما المشكلة في الملف الحالي؟ وأي أوراق أو معادلات تحتاج تعديلًا؟", when: ["type", "تعديل ملف موجود"] },
      { id: "goal", label: "ما العمل الذي تريد أن يساعدك ملف إكسل في إنجازه؟" },
      { id: "data", label: "ما مصادر البيانات والأعمدة وحجم البيانات التقريبي؟", hint: "يكفي وصف أو عينة خالية من بيانات العملاء." },
      { id: "output", label: "ما النتائج التي تريدها؟", hint: "اذكر التقارير والحسابات والفلاتر والرسوم المطلوبة، إن وجدت." },
      { id: "compatibility", label: "أين سيُستخدم الملف؟", options: ["إكسل على الكمبيوتر", "إكسل على الويب", "جداول Google", "غير محدد"] },
    ],
  },
  {
    slug: "social-design", name: "تصميم منشورات التواصل", description: "تصاميم للمنشورات والقصص والإعلانات بمقاسات منصاتك وهوية علامتك.",
    questions: [
      { id: "platforms", label: "ما المنصات والمقاسات المطلوبة؟", hint: "مثلاً منشور إنستغرام، قصة عمودية، أو إعلان فيسبوك." },
      { id: "campaign", label: "ما الهدف من المنشورات؟ ومن الجمهور المستهدف؟" },
      { id: "formats", label: "كم تصميمًا تريد، وما نوعها؟", hint: "تصميم مفرد، سلسلة شرائح، قصص أو قوالب قابلة للتعديل." },
      { id: "copy", label: "هل النصوص جاهزة؟", options: ["النصوص جاهزة", "أحتاج كتابة النصوص", "أحتاج مراجعة نصوص موجودة"] },
      { id: "message", label: "ما الرسالة أو العرض أو الإجراء الذي تريد من الجمهور اتخاذه؟" },
      { id: "brand", label: "هل لديك شعار وألوان وهوية بصرية؟ وما اللغة والأسلوب المطلوبان؟" },
    ],
  },
];

const commonQuestions: Question[] = [
  { id: "deadline", label: "متى تحتاج التسليم؟", hint: "اذكر تاريخًا أو قل إن الموعد مرن." },
  { id: "budget", label: "هل لديك ميزانية تقريبية؟ اذكر العملة إن أمكن.", optional: true },
  { id: "references", label: "هل لديك روابط للمواد أو أمثلة أو ملاحظات إضافية؟", hint: "شارك روابط يمكن للفريق فتحها، وتجنب إرسال كلمات المرور أو البيانات الحساسة.", optional: true },
  { id: "name", label: "ما اسمك؟" },
  { id: "email", label: "ما البريد الإلكتروني الذي نتواصل معك عليه؟", email: true },
];

export const statuses = { new: "جديد", reviewing: "قيد المراجعة", in_progress: "قيد التنفيذ", completed: "مكتمل", closed: "مغلق" } as const;
export type OrderStatus = keyof typeof statuses;
export type OrderAnswer = { id: string; question: string; answer: string };
export type ServiceOrder = {
  id: string; service: string; name: string; email: string;
  answers: OrderAnswer[]; status: OrderStatus; created_at: string;
};

export function getService(slug: string) {
  return services.find(service => service.slug === slug);
}

export function getQuestions(service: Service, answers: AnswerMap) {
  return [...service.questions, ...commonQuestions].filter(question =>
    !question.when || answers[question.when[0]] === question.when[1]
  );
}

export function validAnswer(question: Question, answer: string) {
  if (!answer) return Boolean(question.optional);
  if (question.options) return question.options.includes(answer);
  if (question.email) return answer.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer);
  return answer.length <= (question.id === "name" ? 120 : 1600);
}
