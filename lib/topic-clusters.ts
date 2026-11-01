// Reader needs organize existing published guides. These are editorial choices,
// not measured search demand or a promise that every service is available online.
export const topicClusters = [
  { slug: "electricity", title: "فواتير الكهرباء والعدادات", readerNeed: "أعرف المبلغ الصحيح، أختار خدمة العداد، أو أوثق مشكلة وأتقدم بشكوى.", pathSlugs: ["electricity"] },
  { slug: "civil-documents", title: "الهوية ووثائق الأسرة", readerNeed: "أحدد هل أحتاج تسجيل واقعة جديدة، نسخة من وثيقة، أم تصحيح بياناتها.", pathSlugs: ["birth-certificates", "national-id", "personal-records", "marriage-records", "death-records", "civil-records"] },
  { slug: "driving-vehicles", title: "رخصة السائق ومعاملات السيارة", readerNeed: "أجهز ملف الرخصة الصحيحة، أو أراجع السيارة والمخالفات قبل معاملة أخرى.", pathSlugs: ["driving-licences", "traffic"] },
  { slug: "family-support", title: "التموين والدعم والسكن البديل", readerNeed: "أفهم شروط البرنامج المناسب وأجهز الطلب أو أتابع طلبًا سابقًا.", pathSlugs: ["ration", "takaful-karama", "housing"] },
  { slug: "insurance-pensions", title: "التأمينات والمعاشات", readerNeed: "أراجع سجلي التأميني أو أميز الاستحقاق عن قيمة المعاش المنصرف.", pathSlugs: ["social-insurance", "pensions"] },
  { slug: "business-tax", title: "التسجيل الضريبي والفواتير", readerNeed: "أختار معاملة التسجيل المناسبة ثم أجهز المنشأة للتعامل الإلكتروني.", pathSlugs: ["tax-registration", "e-invoice"] },
  { slug: "travel-documents", title: "الجواز وتصاريح العمل والسفر", readerNeed: "أحدد الوثيقة والجهة المختصة بحسب وجودي داخل مصر أو خارجها.", pathSlugs: ["passports", "work-permits", "military-service", "consular-documents"] },
  { slug: "consumer-rights", title: "الشراء والضمان وحماية المستهلك", readerNeed: "أوثق الشراء والعيب، وأختار الاسترجاع أو الصيانة أو الشكوى المناسبة.", pathSlugs: ["consumer-protection"] },
  { slug: "telecom", title: "المحمول والإنترنت", readerNeed: "أحمي خطي، أفهم متطلبات جهازي، وأوثق ضعف الخدمة قبل التصعيد.", pathSlugs: ["telecom-lines", "telecom-internet", "telecom-devices"] },
  { slug: "digital-tasks", title: "الحسابات والأجهزة والعمل الرقمي", readerNeed: "أختار مهمة محددة لحماية البيانات أو إصلاح مشكلة أو إعداد ملف للعمل والدراسة.", pathSlugs: ["account-security", "android-backup", "android-privacy", "iphone-data", "google-files", "chrome-repair", "chrome-profiles", "chrome-files", "windows-files", "windows-daily", "windows-workspace", "docs-layout", "docs-review", "sheets-data", "sheets-workflow", "forms-build", "forms-publish", "slides-build", "slides-present"] },
] as const;

export const readerQuestions: Record<string, string> = {
  electricity: "أريد معرفة الفاتورة أو حل مشكلة في العداد؛ من أين أبدأ؟",
  "birth-certificates": "أسجل مولودًا لأول مرة أم أحتاج نسخة من شهادة موجودة؟",
  "national-id": "أستخرج بطاقة لأول مرة أم أجددها أو أغير بياناتها؟",
  "personal-records": "هل الجهة تطلب قيدًا عائليًا أم شخصيًا أم صحيفة جنائية؟",
  "marriage-records": "أحتاج نسخة من وثيقة الزواج أو الطلاق أم تصحيح أصل القيد؟",
  "death-records": "أبلغ عن وفاة جديدة أم أطلب شهادة لواقعة مسجلة؟",
  "civil-records": "فقدت وثيقة أو تلفت؛ كيف أختار نوع البدل أو النسخة؟",
  "driving-licences": "أستخرج رخصة قيادة أم أجددها أو أطلب بدلًا لها؟",
  traffic: "أشتري سيارة مستعملة أم أراجع مخالفاتها أو أجدد رخصتها؟",
  ration: "ما خدمة بطاقة التموين المناسبة لوضعي الحالي؟",
  "takaful-karama": "هل أراجع شروط الدعم أم أجهز الملف أم أتابع سبب توقفه؟",
  housing: "هل أتحقق من إتاحة السكن البديل أم أتابع طلبًا سبق إرساله؟",
  "social-insurance": "هل رقمي ومدد عملي والأجور مسجلة بصورة صحيحة؟",
  pensions: "أريد مراجعة المعاش المستحق أم المبلغ الذي صُرف بالفعل؟",
  "tax-registration": "أبدأ ملفًا ضريبيًا أم أعدل ملفًا قائمًا أو أثبت موقفه؟",
  "e-invoice": "كيف أجهز المنشأة للفاتورة أو الإيصال وأعالج تعثر التسجيل؟",
  passports: "أي معاملة جواز تناسب حالتي قبل السفر؟",
  "work-permits": "أحتاج أول تصريح عمل أم تجديدًا أو بدلًا أو مخالصة؟",
  "military-service": "أي شهادة أو تصريح تجنيدي تطلبه معاملتي؟",
  "consular-documents": "أنا خارج مصر؛ ما المعاملة القنصلية المناسبة للوثيقة المطلوبة؟",
  "consumer-protection": "أرجع السلعة أم أطلب إصلاحها أم أقدم شكوى موثقة؟",
  "telecom-lines": "هل الخطوط والمحافظ باسمي صحيحة، وكيف أوقف خدمة أو أبلغ عن إزعاج؟",
  "telecom-internet": "الإنترنت ضعيف أو منقطع؛ كيف أقيس المشكلة وأتابعها؟",
  "telecom-devices": "هل هاتفي يدعم الخدمة، وكيف أتحقق من مطابقته وضمانه؟",
  "account-security": "كيف أؤمّن حسابي وأتعامل مع جهاز غريب أو رسالة مشبوهة؟",
  "android-backup": "كيف أتأكد من نسختي وأنقل بياناتي قبل حذف الأصل؟",
  "android-privacy": "من يصل إلى كاميرا الهاتف وموقعه، وماذا أفعل إذا فقدته؟",
  "iphone-data": "كيف أحفظ بيانات iPhone أو أتصرف عند فقدانه؟",
  "google-files": "أشارك ملفًا أم أستعيده أم أنزل نسخة من بياناتي؟",
  "chrome-repair": "هل العطل من Chrome أم الموقع، وما الفحص المناسب أولًا؟",
  "chrome-profiles": "كيف أفصل الحسابات وأنقل الإشارات دون خلط بياناتها؟",
  "chrome-files": "لماذا يفشل التنزيل أو لا تظهر ترجمة الصفحة؟",
  "windows-files": "كيف أحرر مساحة أو أجهز ملفًا للنقل وأراجع النسخة؟",
  "windows-daily": "كيف أنسخ نصًا أو أحفظ لقطة أو أغير تطبيق فتح الملف؟",
  "windows-workspace": "كيف أرتب النوافذ والنص والتطبيقات التي تبدأ مع الجهاز؟",
  "docs-layout": "كيف أجهز مستندًا واضحًا للطباعة والتسليم؟",
  "docs-review": "كيف أراجع مستندًا مع الآخرين أو أترجمه مع الحفاظ على الأصل؟",
  "sheets-data": "كيف أنظف جدولًا وأرتبه دون خلط بيانات الصفوف؟",
  "sheets-workflow": "كيف أوحّد متابعة المهام وأحمي الخلايا وأعرض النتائج؟",
  "forms-build": "كيف أبني نموذجًا يجمع البيانات اللازمة فقط؟",
  "forms-publish": "كيف أنشر النموذج وأضبط الوصول وأتابع الردود؟",
  "slides-build": "كيف أبني عرضًا مرتبًا يخدم رسالة واحدة؟",
  "slides-present": "كيف أقدم العرض مع الملاحظات وأسئلة الجمهور ونسخة للطباعة؟",
};

type GuideStage = { question: string; articleSlugs: string[] };
export const guideStages: Record<string, GuideStage[]> = {
  electricity: [
    { question: "أريد معرفة الفاتورة أو مراجعة الحساب", articleSlugs: ["electricity-bill-inquiry", "south-delta-electricity", "north-delta-electricity", "north-cairo-electricity", "south-cairo-electricity", "alexandria-electricity", "upper-egypt-electricity", "beheira-electricity"] },
    { question: "أحتاج تركيب عداد أو نقله أو شحنه أو فحصه", articleSlugs: ["electricity-meter-apply", "code-electricity-meter", "electricity-meter-transfer", "prepaid-meter-mobile-charge", "electricity-meter-test"] },
    { question: "لدي انقطاع أو اعتراض وأريد القناة المناسبة", articleSlugs: ["electricity-outage-report", "electricity-complaint", "electricity-consumer-rights", "electricity-company-obligations"] },
  ],
  "birth-certificates": [
    { question: "أحتاج تسجيل مولود أو قيد ميلاد غير مسجل", articleSlugs: ["newborn-birth-registration-egypt", "late-birth-registration-pre-1962"] },
    { question: "أحتاج شهادة لواقعة ميلاد مسجلة", articleSlugs: ["automated-birth-certificate", "birth-certificate-smart-machine"] },
    { question: "الجهة المستلمة تحتاج تصديقًا أو ترجمة", articleSlugs: ["birth-certificate-attestation-egypt", "birth-certificate-certified-translation"] },
  ],
  "national-id": [
    { question: "أحتاج أول بطاقة أو تجديد البطاقة", articleSlugs: ["national-id-first-time-egypt", "national-id-renewal-egypt"] },
    { question: "فقدت البطاقة أو تلفت", articleSlugs: ["national-id-lost-replacement", "national-id-damaged-replacement"] },
    { question: "تغيرت بياناتي أو وجدت خطأ في أصل القيد", articleSlugs: ["national-id-address-change", "national-id-profession-change", "national-id-marital-status-change", "civil-record-correction-egypt", "marriage-divorce-record-correction"] },
    { question: "أحتاج مساعدة بسبب صعوبة الانتقال", articleSlugs: ["civil-status-home-service"] },
  ],
  "driving-licences": [
    { question: "أستخرج رخصة سائق لأول مرة أو أحدد نوعها", articleSlugs: ["private-driving-license-first-time", "motorcycle-driving-license-egypt", "professional-driving-license-egypt", "driving-license-medical-exam"] },
    { question: "رخصتي انتهت أو فقدتها أو تلفت", articleSlugs: ["private-driving-license-renewal", "driving-license-lost-replacement", "driving-license-damaged-replacement"] },
    { question: "معي رخصة أجنبية وأريد معرفة المسار المناسب", articleSlugs: ["foreign-driving-license-egypt"] },
  ],
  traffic: [
    { question: "أراجع سيارة مستعملة قبل الشراء", articleSlugs: ["verify-used-vehicle-license"] },
    { question: "أستعلم عن المخالفات أو أجدد رخصة المركبة", articleSlugs: ["vehicle-violations-inquiry", "vehicle-license-renewal-online"] },
    { question: "رخصة المركبة مفقودة أو تالفة", articleSlugs: ["vehicle-license-lost-replacement", "vehicle-license-damaged-replacement"] },
  ],
  ration: [
    { question: "أراجع البيانات أو ضم فرد للأسرة", articleSlugs: ["ration-data-update", "ration-family-join"] },
    { question: "فقدت البطاقة أو انتقلت لمحافظة أخرى", articleSlugs: ["ration-card-replacement", "ration-card-governorate-transfer"] },
    { question: "استلمت البطاقة وأحتاج تفعيلها", articleSlugs: ["ration-card-activation"] },
  ],
  "social-insurance": [
    { question: "أبحث عن رقمي أو أراجع عملي وأجري المسجل", articleSlugs: ["insurance-number-inquiry", "insurance-last-period", "insurance-periods-wages", "insurance-deductions-inquiry"] },
    { question: "أفكر في حساب مدة تأمينية سابقة", articleSlugs: ["insurance-purchase-duration"] },
  ],
  pensions: [
    { question: "أراجع الاستحقاق بصفتي مستفيدًا", articleSlugs: ["beneficiary-pensions-inquiry"] },
    { question: "أراجع قيمة المعاش الذي صُرف", articleSlugs: ["pension-payment-inquiry"] },
  ],
  "tax-registration": [
    { question: "أبدأ التسجيل وأحدد نوعه", articleSlugs: ["tax-card-first-time-egypt", "simplified-tax-registration-egypt"] },
    { question: "أعدل البيانات أو أطلب بدل البطاقة", articleSlugs: ["tax-registration-data-update", "tax-card-lost-damaged-replacement"] },
    { question: "أحتاج مستندًا يثبت البيانات أو موقف القيمة المضافة", articleSlugs: ["tax-basic-data-certificate", "vat-registration-status-certificate"] },
    { question: "أوقف النشاط أو أستأنفه", articleSlugs: ["tax-registration-cancel-suspend", "tax-registration-reactivation"] },
  ],
  "e-invoice": [
    { question: "أجهز التسجيل والختم وأكواد الأصناف", articleSlugs: ["e-invoice-self-registration", "e-invoice-digital-signature", "e-invoice-gs1-egs-codes"] },
    { question: "التسجيل متعثر أو أحتاج الإيصال الإلكتروني", articleSlugs: ["e-invoice-registration-errors", "e-receipt-readiness"] },
  ],
  passports: [
    { question: "أصدر جوازًا أول مرة أو أجدد المنتهي", articleSlugs: ["passport-first-time-egypt", "child-passport-egypt", "passport-renewal-expired-full"] },
    { question: "فقدت الجواز أو تلف أو أحتاج خدمة عاجلة", articleSlugs: ["passport-lost-inside-egypt", "passport-damaged-replacement-egypt", "passport-urgent-service-egypt"] },
    { question: "الجهة تطلب شهادة بيانات أو تحركات", articleSlugs: ["passport-data-certificate-egypt", "movement-certificate-egypt"] },
  ],
  "consumer-protection": [
    { question: "أتحقق من الشراء والفاتورة والإعلان", articleSlugs: ["online-shopping-consumer-rights-egypt", "consumer-invoice-rights-egypt", "misleading-ad-complaint-egypt"] },
    { question: "أطلب الاسترجاع أو الصيانة وقطع الغيار", articleSlugs: ["consumer-return-exchange-egypt", "product-warranty-repair-egypt", "authorized-service-center-egypt", "product-lifetime-spare-parts-egypt"] },
    { question: "لم تُحل المشكلة وأحتاج شكوى موثقة", articleSlugs: ["consumer-protection-complaint-egypt"] },
  ],
  "takaful-karama": [
    { question: "أراجع الشروط قبل تقديم طلب جديد", articleSlugs: ["takaful-karama-eligibility", "takaful-karama-apply-documents"] },
    { question: "قدمت بالفعل وأحتاج متابعة أو شكوى", articleSlugs: ["takaful-karama-inquiry-complaint"] },
  ],
  housing: [
    { question: "أتحقق أولًا من الموعد وإتاحة التقديم", articleSlugs: ["old-rent-housing-apply"] },
    { question: "أجهز الأهلية والمستندات وقناة التقديم", articleSlugs: ["old-rent-housing-eligibility", "old-rent-housing-documents", "old-rent-housing-post-office"] },
    { question: "لدي طلب سابق وأتابع النواقص أو النتيجة", articleSlugs: ["old-rent-housing-track"] },
  ],
};

export function getTopicCluster(pathSlug: string) {
  return topicClusters.find(cluster => (cluster.pathSlugs as readonly string[]).includes(pathSlug));
}
