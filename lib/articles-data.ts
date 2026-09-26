export type ArticleGroup = "pillar" | "distributors" | "payments" | "core" | "bonus";

export type ArticleSeed = {
  id: number;
  clusterCode: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  group: ArticleGroup;
  title: string;
  keyword: string;
  volume: number;
  kd: number | null;
  month: number;
};

// Transcribed verbatim from the keyword plan (OpenSEO / DataForSEO, أغسطس ٢٠٢٦).
// volume/kd are the plan's estimates, not live data — re-verify before publishing.
export const articleSeeds: ArticleSeed[] = [
  // Editorial additions: zero volume means unmeasured, not a search-volume estimate.
  { id: 118, clusterCode: "B", group: "bonus", title: "التسجيل في السكن البديل للإيجار القديم قبل 12 أكتوبر 2026", keyword: "تقديم السكن البديل", volume: 0, kd: null, month: 1 },
  { id: 119, clusterCode: "B", group: "bonus", title: "شروط السكن البديل: من يحق له التقديم وكيف تُفحص الأهلية؟", keyword: "شروط السكن البديل", volume: 0, kd: null, month: 1 },
  { id: 120, clusterCode: "B", group: "bonus", title: "مستندات السكن البديل: إثبات الإيجار والحالة الاجتماعية والدخل", keyword: "مستندات السكن البديل", volume: 0, kd: null, month: 1 },
  { id: 121, clusterCode: "B", group: "bonus", title: "التقديم على السكن البديل من مكتب البريد: ما الذي تحضره؟", keyword: "السكن البديل مكاتب البريد", volume: 0, kd: null, month: 1 },
  { id: 122, clusterCode: "B", group: "bonus", title: "متابعة طلب السكن البديل واستكمال النواقص والتظلم من الرفض", keyword: "متابعة طلب السكن البديل", volume: 0, kd: null, month: 1 },
  { id: 108, clusterCode: "H", group: "bonus", title: "تنظيم رسائل Gmail بفلاتر تلقائية دون فقد الرسائل المهمة", keyword: "إنشاء فلاتر Gmail", volume: 0, kd: null, month: 1 },
  { id: 109, clusterCode: "H", group: "bonus", title: "رموز Google الاحتياطية: إعدادها واستخدامها عند تعذر التحقق", keyword: "رموز Google الاحتياطية", volume: 0, kd: null, month: 1 },
  { id: 110, clusterCode: "H", group: "bonus", title: "تنزيل نسخة من بيانات Google: متى تستخدم Takeout والتنزيل المباشر؟", keyword: "تنزيل بيانات Google Takeout", volume: 0, kd: null, month: 1 },
  { id: 111, clusterCode: "H", group: "bonus", title: "إيقاف إشعارات Chrome والنوافذ المزعجة على الكمبيوتر", keyword: "إيقاف إشعارات Chrome المزعجة", volume: 0, kd: null, month: 1 },
  { id: 112, clusterCode: "H", group: "bonus", title: "مشاركة ملف Google Drive بأمان وحل مشكلة طلب الوصول", keyword: "مشاركة ملف Google Drive بأمان", volume: 0, kd: null, month: 1 },
  { id: 113, clusterCode: "H", group: "bonus", title: "استعادة ملف محذوف من Google Drive: المهملات وحدود الاسترداد", keyword: "استعادة ملفات Google Drive المحذوفة", volume: 0, kd: null, month: 1 },
  { id: 114, clusterCode: "H", group: "bonus", title: "مراجعة الأجهزة المتصلة بحساب Google وتسجيل خروج جهاز غريب", keyword: "الأجهزة المتصلة بحساب Google", volume: 0, kd: null, month: 1 },
  { id: 115, clusterCode: "H", group: "bonus", title: "رسالة مشبوهة في Gmail: كيف تتحقق وتبلغ عن التصيّد؟", keyword: "الإبلاغ عن التصيد في Gmail", volume: 0, kd: null, month: 1 },
  { id: 116, clusterCode: "H", group: "bonus", title: "نسخ iPhone احتياطيًا: اختيار iCloud أو الكمبيوتر وفحص النتيجة", keyword: "النسخ الاحتياطي للايفون", volume: 0, kd: null, month: 1 },
  { id: 117, clusterCode: "H", group: "bonus", title: "فقدان iPhone: العثور عليه وتفعيل نمط الفقدان دون الوقوع في الاحتيال", keyword: "العثور على ايفون مفقود", volume: 0, kd: null, month: 1 },
  // --- Cluster A: فواتير الكهرباء (الشهر ١–٢) ---
  { id: 1, clusterCode: "A", group: "pillar", title: "الدليل الشامل لفاتورة الكهرباء في مصر", keyword: "فاتورة الكهرباء", volume: 74000, kd: 18, month: 1 },
  { id: 2, clusterCode: "A", group: "pillar", title: "الاستعلام عن فاتورة الكهرباء — كل الطرق", keyword: "الاستعلام عن فاتورة الكهرباء", volume: 40500, kd: 29, month: 1 },
  { id: 3, clusterCode: "A", group: "pillar", title: "الاستعلام برقم العداد خطوة بخطوة", keyword: "الاستعلام عن فاتورة الكهرباء برقم العداد", volume: 14800, kd: 14, month: 1 },
  { id: 4, clusterCode: "A", group: "pillar", title: "الاستعلام بالاسم فقط — هل يمكن؟", keyword: "الاستعلام عن فاتورة الكهرباء بالاسم فقط", volume: 8100, kd: 11, month: 1 },
  { id: 5, clusterCode: "A", group: "pillar", title: "تسجيل قراءة العداد بنفسك", keyword: "تسجيل قراءة عداد الكهرباء", volume: 3600, kd: 33, month: 1 },
  { id: 6, clusterCode: "A", group: "pillar", title: "الاستعلام عبر الهاتف", keyword: "الاستعلام عن فاتورة الكهرباء عن طريق الهاتف", volume: 1600, kd: 24, month: 1 },
  { id: 7, clusterCode: "A", group: "pillar", title: "الاستعلام بالاسم والعنوان", keyword: "الاستعلام عن فاتورة الكهرباء بالاسم والعنوان", volume: 1300, kd: 16, month: 1 },
  { id: 8, clusterCode: "A", group: "pillar", title: "الاستعلام برقم العداد القديم", keyword: "الاستعلام عن فاتورة الكهرباء برقم العداد القديم", volume: 590, kd: 13, month: 1 },

  { id: 9, clusterCode: "A", group: "distributors", title: "شركة جنوب القاهرة — دليل كامل", keyword: "شركة جنوب القاهرة لتوزيع الكهرباء", volume: 12100, kd: 3, month: 1 },
  { id: 10, clusterCode: "A", group: "distributors", title: "شركة شمال الدلتا — دليل كامل", keyword: "شركة شمال الدلتا لتوزيع الكهرباء", volume: 9900, kd: 6, month: 1 },
  { id: 11, clusterCode: "A", group: "distributors", title: "شركة كهرباء الإسكندرية — دليل كامل", keyword: "شركة كهرباء الاسكندرية", volume: 9900, kd: 0, month: 1 },
  { id: 12, clusterCode: "A", group: "distributors", title: "شركة جنوب الدلتا — دليل كامل", keyword: "شركة جنوب الدلتا لتوزيع الكهرباء", volume: 6600, kd: 3, month: 1 },
  { id: 13, clusterCode: "A", group: "distributors", title: "شركة شمال القاهرة — دليل كامل", keyword: "شركة شمال القاهرة لتوزيع الكهرباء", volume: 6600, kd: 1, month: 1 },
  { id: 14, clusterCode: "A", group: "distributors", title: "فاتورة كهرباء شمال الدلتا", keyword: "فاتورة الكهرباء شمال الدلتا", volume: 5400, kd: 8, month: 1 },
  { id: 15, clusterCode: "A", group: "distributors", title: "استعلام شمال الدلتا", keyword: "الاستعلام عن فاتورة الكهرباء شمال الدلتا", volume: 5400, kd: 6, month: 1 },
  { id: 16, clusterCode: "A", group: "distributors", title: "فاتورة كهرباء الإسكندرية", keyword: "فاتورة كهرباء الاسكندرية", volume: 5400, kd: 5, month: 1 },
  { id: 17, clusterCode: "A", group: "distributors", title: "فاتورة كهرباء جنوب الدلتا", keyword: "فاتورة الكهرباء جنوب الدلتا", volume: 4400, kd: 8, month: 1 },
  { id: 18, clusterCode: "A", group: "distributors", title: "استعلام مصر الوسطى", keyword: "الاستعلام عن فاتورة الكهرباء مصر الوسطى", volume: 8100, kd: 12, month: 2 },
  { id: 19, clusterCode: "A", group: "distributors", title: "استعلام شمال القاهرة", keyword: "الاستعلام عن فاتورة الكهرباء شمال القاهرة", volume: 3600, kd: 1, month: 2 },
  { id: 20, clusterCode: "A", group: "distributors", title: "استعلام الإسكندرية", keyword: "الاستعلام عن فاتورة الكهرباء بالاسكندرية", volume: 2900, kd: 8, month: 2 },
  { id: 21, clusterCode: "A", group: "distributors", title: "جنوب القاهرة فرع أكتوبر", keyword: "شركة جنوب القاهرة لتوزيع الكهرباء أكتوبر", volume: 2900, kd: 0, month: 2 },
  { id: 22, clusterCode: "A", group: "distributors", title: "استعلام جنوب الدلتا", keyword: "الاستعلام عن فاتورة الكهرباء شركة جنوب الدلتا", volume: 2400, kd: 5, month: 2 },
  { id: 23, clusterCode: "A", group: "distributors", title: "استعلام شمال القاهرة برقم العداد", keyword: "الاستعلام عن فاتورة الكهرباء شمال القاهرة برقم العداد", volume: 1900, kd: 6, month: 2 },
  { id: 24, clusterCode: "A", group: "distributors", title: "فاتورة جنوب القاهرة", keyword: "فاتورة الكهرباء جنوب القاهرة", volume: 1600, kd: 8, month: 2 },
  { id: 25, clusterCode: "A", group: "distributors", title: "موقع sdedc للاستعلام", keyword: "www sdedc net الاستعلام عن الفواتير", volume: 1300, kd: 7, month: 2 },

  { id: 26, clusterCode: "A", group: "payments", title: "دفع فاتورة الكهرباء عبر فوري", keyword: "دفع فاتورة الكهرباء فوري", volume: 1300, kd: 9, month: 2 },
  { id: 27, clusterCode: "A", group: "payments", title: "الدفع بالفيزا", keyword: "دفع فاتورة الكهرباء بالفيزا", volume: 880, kd: 6, month: 2 },
  { id: 28, clusterCode: "A", group: "payments", title: "سداد شمال القاهرة", keyword: "سداد فاتورة الكهرباء شمال القاهرة", volume: 880, kd: 4, month: 2 },
  { id: 29, clusterCode: "A", group: "payments", title: "دفع شمال الدلتا", keyword: "دفع فاتورة الكهرباء شمال الدلتا", volume: 880, kd: 10, month: 2 },
  { id: 30, clusterCode: "A", group: "payments", title: "الدفع أونلاين — مقارنة الوسائل", keyword: "دفع فاتورة الكهرباء عن طريق النت", volume: 260, kd: 21, month: 2 },
  { id: 31, clusterCode: "A", group: "payments", title: "إدخال قراءة العداد الإسكندرية", keyword: "إدخال قراءة عداد الكهرباء الاسكندرية", volume: 1000, kd: 12, month: 2 },
  { id: 32, clusterCode: "A", group: "payments", title: "تسجيل القراءة شمال القاهرة", keyword: "تسجيل قراءة عداد الكهرباء شمال القاهرة", volume: 590, kd: 5, month: 2 },
  { id: 33, clusterCode: "A", group: "payments", title: "أكواد السداد الإلكتروني", keyword: "كود السداد الالكتروني للكهرباء جنوب القاهرة", volume: 260, kd: 0, month: 2 },
  { id: 34, clusterCode: "A", group: "payments", title: "الدفع عبر إنستاباي", keyword: "دفع فاتورة الكهرباء الاسكندرية انستا باي", volume: 170, kd: 0, month: 2 },
  { id: 35, clusterCode: "A", group: "payments", title: "تطبيقات شركات الكهرباء", keyword: "تطبيق شركة شمال الدلتا لتوزيع الكهرباء", volume: 210, kd: 12, month: 2 },

  // --- Cluster B: بوابة مصر الرقمية (الشهر ٢–٣) ---
  { id: 36, clusterCode: "B", group: "core", title: "بوابة مصر الرقمية — الدليل الشامل", keyword: "بوابة مصر الرقمية", volume: 450000, kd: 28, month: 2 },
  { id: 37, clusterCode: "B", group: "core", title: "خدمات التموين على البوابة", keyword: "مصر الرقمية للتموين", volume: 40500, kd: 21, month: 2 },
  { id: 38, clusterCode: "B", group: "core", title: "التسجيل خطوة بخطوة", keyword: "التسجيل في بوابة مصر الرقمية", volume: 33100, kd: 20, month: 2 },
  { id: 39, clusterCode: "B", group: "core", title: "التسجيل لخدمات التموين", keyword: "التسجيل في بوابة مصر الرقمية التموين", volume: 27100, kd: 31, month: 2 },
  { id: 40, clusterCode: "B", group: "core", title: "إضافة المواليد لبطاقة التموين", keyword: "بوابة مصر الرقمية لإضافة المواليد", volume: 18100, kd: 20, month: 3 },
  { id: 41, clusterCode: "B", group: "core", title: "قائمة كل الخدمات المتاحة", keyword: "خدمات بوابة مصر الرقمية", volume: 12100, kd: 28, month: 3 },
  { id: 42, clusterCode: "B", group: "core", title: "بوابة المرور الإلكترونية", keyword: "بوابة مرور مصر", volume: 9900, kd: 4, month: 3 },
  { id: 43, clusterCode: "B", group: "core", title: "خدمات الرقم القومي", keyword: "بوابة مصر الرقمية الرقم القومي", volume: 8100, kd: 17, month: 3 },
  { id: 44, clusterCode: "B", group: "core", title: "الإسكان الاجتماعي عبر البوابة", keyword: "التسجيل في بوابة مصر الرقمية للاسكان الاجتماعي", volume: 4400, kd: 19, month: 3 },
  { id: 45, clusterCode: "B", group: "core", title: "الاستعلام عن بطاقة التموين", keyword: "مصر الرقمية استعلام عن بطاقة التموين", volume: 4400, kd: 27, month: 3 },
  { id: 46, clusterCode: "B", group: "core", title: "تحميل التطبيق وحل مشاكله", keyword: "تحميل تطبيق مصر الرقمية", volume: 3600, kd: 30, month: 3 },
  { id: 47, clusterCode: "B", group: "core", title: "التواصل مع الدعم الفني", keyword: "دعم مصر الرقمية", volume: 3600, kd: 36, month: 3 },
  { id: 48, clusterCode: "B", group: "core", title: "تحديث بطاقة التموين برقم الموبايل", keyword: "تحديث بطاقة التموين برقم الموبايل", volume: 3600, kd: 30, month: 3 },
  { id: 49, clusterCode: "B", group: "core", title: "بوابة الحكومة الإلكترونية", keyword: "بوابة خدمات الحكومة الإلكترونية", volume: 2900, kd: 22, month: 3 },
  { id: 50, clusterCode: "B", group: "core", title: "التسجيل في بوابة الحكومة", keyword: "التسجيل في بوابة الحكومة الإلكترونية", volume: 2400, kd: 41, month: 3 },
  { id: 51, clusterCode: "B", group: "core", title: "حل مشاكل التسجيل الشائعة", keyword: "مشكلة التسجيل في بوابة مصر الرقمية", volume: 260, kd: 18, month: 3 },
  { id: 52, clusterCode: "B", group: "core", title: "تحديث بيانات التموين", keyword: "التسجيل في بوابة مصر الرقمية التموين تحديث بيانات", volume: 480, kd: 20, month: 3 },
  { id: 53, clusterCode: "B", group: "core", title: "خدمات الأحوال المدنية", keyword: "خدمات بوابة مصر الرقمية الأحوال المدنية", volume: 40, kd: null, month: 3 },
  { id: 54, clusterCode: "B", group: "core", title: "خدمات السجل التجاري", keyword: "خدمات بوابة مصر الرقمية السجل التجاري", volume: 30, kd: null, month: 3 },

  // --- Cluster C: رخص القيادة والمرور (الشهر ٣) ---
  { id: 55, clusterCode: "C", group: "core", title: "تجديد رخصة القيادة — الدليل الكامل ٢٠٢٦", keyword: "تجديد رخصة القيادة", volume: 12100, kd: 0, month: 3 },
  { id: 56, clusterCode: "C", group: "core", title: "تجديد رخصة السيارة — الدليل الكامل", keyword: "تجديد رخصة السيارة", volume: 6600, kd: 0, month: 3 },
  { id: 57, clusterCode: "C", group: "core", title: "التجديد الفوري للرخصة الشخصية", keyword: "تجديد رخصة القيادة الشخصية فوري", volume: 2400, kd: 0, month: 3 },
  { id: 58, clusterCode: "C", group: "core", title: "التجديد من المنزل", keyword: "تجديد رخصة القيادة الخاصة من المنزل", volume: 1900, kd: 0, month: 3 },
  { id: 59, clusterCode: "C", group: "core", title: "حجز موعد بوحدات المرور", keyword: "حجز موعد بوحدات المرور الإلكترونية", volume: 1900, kd: 0, month: 3 },
  { id: 60, clusterCode: "C", group: "core", title: "تكلفة التجديد ٢٠٢٦", keyword: "تكلفة تجديد رخصة القيادة", volume: 1300, kd: 0, month: 3 },
  { id: 61, clusterCode: "C", group: "core", title: "رسوم رخصة ١٠ سنوات", keyword: "رسوم تجديد رخصة القيادة 10 سنوات", volume: 880, kd: 0, month: 3 },
  { id: 62, clusterCode: "C", group: "core", title: "الاستعلام عن المخالفات بالرقم القومي", keyword: "الاستعلام عن مخالفات رخصة القيادة بالرقم القومي", volume: 880, kd: 3, month: 3 },
  { id: 63, clusterCode: "C", group: "core", title: "تجديد رخصة السيارة بدون فحص", keyword: "تجديد رخصة السيارة بدون فحص", volume: 720, kd: 0, month: 3 },
  { id: 64, clusterCode: "C", group: "core", title: "حجز موعد تجديد رخصة السيارة", keyword: "حجز موعد تجديد رخصة السيارة", volume: 720, kd: 0, month: 3 },
  { id: 65, clusterCode: "C", group: "core", title: "تكلفة التجديد مع الفحص", keyword: "كم تكلفة تجديد رخصة السيارة مع الفحص", volume: 720, kd: 0, month: 3 },
  { id: 66, clusterCode: "C", group: "core", title: "التجديد عبر بوابة مصر الرقمية", keyword: "بوابة مصر الرقمية تجديد رخصة القيادة", volume: 590, kd: 8, month: 3 },
  { id: 67, clusterCode: "C", group: "core", title: "تكلفة الرخصة الخاصة ٢٠٢٦", keyword: "تكلفة تجديد رخصة القيادة الخاصة 2026", volume: 590, kd: 0, month: 3 },
  { id: 68, clusterCode: "C", group: "core", title: "فترة السماح بعد الانتهاء", keyword: "فترة سماح تجديد رخصة القيادة الخاصة", volume: 320, kd: 0, month: 3 },
  { id: 69, clusterCode: "C", group: "core", title: "وحدة مرور سيتي ستارز — دليل", keyword: "تجديد رخصة القيادة سيتي ستارز", volume: 390, kd: 0, month: 3 },
  { id: 70, clusterCode: "C", group: "core", title: "غرامة التأخير في التجديد", keyword: "غرامة تأخير تجديد رخصة القيادة مصر", volume: 140, kd: 0, month: 3 },
  { id: 71, clusterCode: "C", group: "core", title: "الأوراق المطلوبة للتجديد", keyword: "ما المطلوب عند تجديد رخصة القيادة الخاصة", volume: 260, kd: 0, month: 3 },
  { id: 72, clusterCode: "C", group: "core", title: "أماكن التجديد في القاهرة والجيزة", keyword: "أماكن تجديد رخصة القيادة", volume: 260, kd: 0, month: 3 },
  { id: 73, clusterCode: "C", group: "core", title: "رسوم رخصة الدراجة النارية ٢٠٢٦", keyword: "تكلفة تجديد رخصة قيادة دراجة نارية 2026", volume: 210, kd: 0, month: 3 },
  { id: 74, clusterCode: "C", group: "core", title: "تجديد الرخصة المنتهية", keyword: "تجديد رخصة القيادة المنتهية", volume: 260, kd: 0, month: 3 },

  // --- Cluster D: حماية المستهلك (الشهر ٤) ---
  { id: 75, clusterCode: "D", group: "core", title: "جهاز حماية المستهلك — الدليل الشامل", keyword: "جهاز حماية المستهلك", volume: 18100, kd: 29, month: 4 },
  { id: 76, clusterCode: "D", group: "core", title: "كل أرقام التواصل والفروع", keyword: "رقم حماية المستهلك", volume: 14800, kd: 6, month: 4 },
  { id: 77, clusterCode: "D", group: "core", title: "كيف تقدم شكوى — خطوة بخطوة", keyword: "شكاوى حماية المستهلك", volume: 5400, kd: 17, month: 4 },
  { id: 78, clusterCode: "D", group: "core", title: "حماية المستهلك في مصر", keyword: "حماية المستهلك مصر", volume: 5400, kd: 20, month: 4 },
  { id: 79, clusterCode: "D", group: "core", title: "رقم خدمة العملاء", keyword: "رقم خدمة حماية المستهلك", volume: 2900, kd: 9, month: 4 },
  { id: 80, clusterCode: "D", group: "core", title: "دليل حقوقك كمستهلك", keyword: "دليل حماية المستهلك", volume: 1600, kd: 13, month: 4 },
  { id: 81, clusterCode: "D", group: "core", title: "متابعة حالة الشكوى", keyword: "متابعة شكوى حماية المستهلك", volume: 1300, kd: 9, month: 4 },
  { id: 82, clusterCode: "D", group: "core", title: "التواصل عبر واتساب", keyword: "حماية المستهلك واتساب", volume: 480, kd: 1, month: 4 },
  { id: 83, clusterCode: "D", group: "core", title: "تطبيق حماية المستهلك", keyword: "تطبيق حماية المستهلك", volume: 320, kd: 24, month: 4 },
  { id: 84, clusterCode: "D", group: "core", title: "حقوقك في الاسترجاع والاستبدال", keyword: "قانون حماية المستهلك في الاسترجاع", volume: 140, kd: 0, month: 4 },
  { id: 85, clusterCode: "D", group: "core", title: "القانون الجديد — ملخص عملي", keyword: "قانون حماية المستهلك الجديد pdf", volume: 170, kd: 0, month: 4 },
  { id: 86, clusterCode: "D", group: "core", title: "اختصاصات الجهاز وحدوده", keyword: "اختصاصات جهاز حماية المستهلك", volume: 140, kd: 2, month: 4 },
  { id: 87, clusterCode: "D", group: "core", title: "مواعيد العمل والعناوين", keyword: "مواعيد عمل جهاز حماية المستهلك", volume: 260, kd: 0, month: 4 },
  { id: 88, clusterCode: "D", group: "core", title: "تجارب حقيقية مع الجهاز", keyword: "تجربتي مع جهاز حماية المستهلك", volume: 210, kd: 3, month: 4 },

  // --- Cluster E: المحافظ الإلكترونية (الشهر ٥) ---
  { id: 89, clusterCode: "E", group: "core", title: "إلغاء محفظة ميزة", keyword: "إلغاء محفظة ميزة", volume: 5400, kd: 5, month: 5 },
  { id: 90, clusterCode: "E", group: "core", title: "أكواد محفظة WE كاش", keyword: "أكواد محفظة we كاش", volume: 2400, kd: 0, month: 5 },
  { id: 91, clusterCode: "E", group: "core", title: "محفظة بنك مصر — دليل كامل", keyword: "محفظة بنك مصر", volume: 2400, kd: 17, month: 5 },
  { id: 92, clusterCode: "E", group: "core", title: "إدارة محفظة الهاتف", keyword: "إدارة محفظة الهاتف", volume: 1600, kd: 0, month: 5 },
  { id: 93, clusterCode: "E", group: "core", title: "إلغاء أي محفظة إلكترونية", keyword: "لينك إلغاء المحافظ الإلكترونية", volume: 1300, kd: 5, month: 5 },
  { id: 94, clusterCode: "E", group: "core", title: "المحافظ الإلكترونية — المقارنة الشاملة", keyword: "المحفظة الإلكترونية", volume: 1000, kd: 15, month: 5 },
  { id: 95, clusterCode: "E", group: "core", title: "كيف تعرف المحافظ المسجلة على رقمك", keyword: "كيفية معرفة المحافظ الإلكترونية المشترك بها", volume: 260, kd: 0, month: 5 },

  // --- Cluster F: عقود الإيجار (الشهر ٥) ---
  { id: 96, clusterCode: "F", group: "core", title: "عقد الإيجار — الدليل القانوني الكامل", keyword: "عقد ايجار", volume: 14800, kd: 1, month: 5 },
  { id: 97, clusterCode: "F", group: "core", title: "نموذج عقد إيجار شقة PDF", keyword: "نموذج عقد ايجار شقة pdf", volume: 2400, kd: 0, month: 5 },
  { id: 98, clusterCode: "F", group: "core", title: "نموذج جاهز للطباعة", keyword: "نموذج عقد ايجار جاهز للطباعة", volume: 1300, kd: 0, month: 5 },
  { id: 99, clusterCode: "F", group: "core", title: "عقد الإيجار وفق القانون الجديد", keyword: "نموذج عقد إيجار شقة قانون جديد", volume: 590, kd: 0, month: 5 },
  { id: 100, clusterCode: "F", group: "core", title: "توثيق عقد الإيجار", keyword: "توثيق عقد إيجار", volume: 480, kd: 2, month: 5 },

  // --- Cluster G: شهادة الميلاد والسجل المدني (الشهر ٦ — إضافي، خارج الأول ١٠٠) ---
  { id: 101, clusterCode: "G", group: "bonus", title: "استخراج شهادة ميلاد — الدليل الكامل", keyword: "استخراج شهادة ميلاد", volume: 5400, kd: null, month: 6 },
  { id: 102, clusterCode: "G", group: "bonus", title: "شهادة ميلاد كمبيوتر فوري", keyword: "شهادة ميلاد كمبيوتر فوري", volume: 1600, kd: null, month: 6 },
  { id: 103, clusterCode: "G", group: "bonus", title: "الاستخراج من مكتب البريد", keyword: "استخراج شهادة ميلاد من البريد", volume: 720, kd: null, month: 6 },
  { id: 104, clusterCode: "G", group: "bonus", title: "الاستعلام عن شهادة الميلاد بالاسم", keyword: "الاستعلام عن شهادة الميلاد بالاسم", volume: 720, kd: null, month: 6 },
  { id: 105, clusterCode: "G", group: "bonus", title: "أماكن ماكينات السجل المدني الذكي", keyword: "أماكن ماكينات السجل المدني الذكي", volume: 970, kd: null, month: 6 },
  { id: 106, clusterCode: "G", group: "bonus", title: "تكلفة استخراج شهادة الميلاد", keyword: "تكلفة استخراج شهادة ميلاد", volume: 210, kd: null, month: 6 },
  { id: 107, clusterCode: "G", group: "bonus", title: "شهادة الميلاد عبر بوابة مصر الرقمية", keyword: "بوابة مصر الرقمية شهادة الميلاد", volume: 170, kd: null, month: 6 },
];
