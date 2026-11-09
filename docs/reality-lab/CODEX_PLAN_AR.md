# خطة Codex — مختبر لوسيل للواقع: المحمصة والفروع

**الإصدار:** Web MVP v0.3، مشروع COFFEE-001. **الحالة:** واجهة تشغيل ومحاكاة استكشافية، غير متصلة بمخازن أو POS حقيقي.

## الهدف والقرار المعماري
- **Codex / GitHub:** تطوير الكود، اختبارات المحاكاة، مراجعة طلبات الدمج، إدارة نسخ النموذج.
- **Next.js / Vercel:** واجهة RTL في /reality-lab و API تشغيل bounded في /api/reality-lab/run.
- **Supabase Postgres (مستهدف، لم يُربط):** تخزين بيانات التشغيل المجمعة، مصادر البيانات، تعريفات السيناريوهات، التجارب، نتائج التشغيل، والصلاحيات.
- **Python simulation worker (مستهدف):** تشغيل محرك المحمصة التفصيلي الموجود في حزمة Reality Lab v0.2، وإجراء تجارب طويلة أو ثقيلة خارج حدود وظائف Vercel.
- **النشر:** فرع مراجعة أولًا؛ لا تُنشر بيانات الشركة ولا تُتاح صفحات إدارة حقيقية دون مصادقة.

## ما يعمل في النسخة الحالية
1. واجهة متابعة عربية منفصلة داخل موقع لوسيل تعرض مؤشرات المحمصة والفروع الخمسة.
2. محرك TypeScript على الخادم: مرور الطلبات، صفوف التحضير، المخزون، التحميص، التوزيع، نفاد البن، والإيراد الافتراضي.
3. سيناريوهات: تأخر التوزيع، انخفاض قدرة التحميص، ارتفاع الطلب، إضافة موظف؛ مع ضبط القيم يدويًا.
4. إعادة إنتاج التجربة باستخدام seed وعدة تكرارات؛ عرض التباين المحاكى P10–P90.
5. استيراد CSV محلي لمتوسطات الطلب اليومي فقط، دون رفع الملف الخام إلى الخادم.
6. تصدير JSON للنتائج وسجل آخر 20 تشغيلًا داخل localStorage، وليس سجلًا مركزيًا.
7. تعطيل فهرسة لوحة العرض التجريبية.

**مهم:** المحرك TypeScript الجديد يبسط المحرك العلمي Python v0.2، ولا يحل محله في الدراسات المتقدمة؛ لا نعتبر النموذجين متكافئين أو مُعايرين.

## ملفات الكود
- app/reality-lab/page.tsx — تجربة المستخدم وإدخال البيانات والرسوم.
- app/reality-lab/dashboard.css — تصميم RTL المتجاوب.
- app/reality-lab/layout.tsx — noindex.
- app/api/reality-lab/run/route.ts — API تشغيل حقيقي بخواص تحقق وحدود.
- lib/reality-lab/model.ts — النواة الحسابية القابلة لإعادة الإنتاج.
- scripts/test-reality-lab.mjs — اختبارات ثبات ومحددات المدخلات.
- components/site-frame.tsx — عزل تخطيط المختبر عن رأس وتذييل الموسوعة.

## تشغيل محلي
npm ci
npm run lab:test
npm run dev
# ثم http://localhost:3000/reality-lab

## عقد إدخال البيانات
POST /api/reality-lab/run
Content-Type: application/json

{
  "days":14,
  "repetitions":12,
  "seed":42,
  "demandFactor":1,
  "deliveryDays":1,
  "roastCapacityKg":20,
  "extraAlKhorBaristas":0,
  "branchOrdersPerDay":{"alkhor":90,"muaither":130}
}

**CSV اختياري للمعايرة الأولية:** date,branch,orders مع معرفات الفروع:
muaither, mesaimeer, hilal, alkhor, rawdat.
الحد 1 MB، ويجري تحليله في المتصفح. لا ترفع أسماء أو هواتف أو تفاصيل دفع.

## خط البيانات المستهدف
POS/ERP/roast logs (مصادر مُصرّح بها)
 -> connectors import
 -> raw private staging + hashes
 -> validation/quarantine (schema, timezone Asia/Qatar, duplicate detection)
 -> normalized fact tables
 -> versioned parameters / calibration
 -> job queue
 -> Python simulation workers
 -> runs + metrics + uncertainty + data provenance
 -> read-only dashboard with RBAC and alerts.

## مخطط قاعدة البيانات المستهدف (لم ينفذ)
- projects(id,tenant_id,name,visibility,created_at)
- data_sources(id,project_id,source_kind,owner,consent_status,refresh_policy)
- ingestion_batches(id,data_source_id,checksum,range_start,range_end,rows_ok,rows_rejected,status)
- branch_daily_metrics(id,project_id,branch_id,business_date,paid_orders,stockout_count,avg_wait_min,source_batch_id)
- model_versions(id,project_id,git_sha,parameter_hash,validation_status,created_at)
- scenarios(id,project_id,name,inputs_json,created_by)
- simulation_runs(id,project_id,scenario_id,model_version_id,seed,replications,status,started_at,finished_at)
- simulation_metrics(id,run_id,metric_key,branch_id,day,value,unit,p10,p90)
- alerts(id,project_id,metric_key,threshold,rule,active)

**الأمان:** واجهات كتابة وقراءة بيانات الشركة تحتاج جلسات تسجيل دخول وصلاحيات لكل مشروع، وسياسات RLS، وسجل تدقيق، وحدود API. لا تخزن مفاتيح خدمة في المتصفح، ولا ترفع بيانات العملاء الأصلية.

## خارطة تنفيذ Codex (مرتبة)
### P0 — قبل إدخال بيانات حقيقية
- إضافة تسجيل الدخول والجلسات وقيود أدوار Admin / Researcher / Viewer.
- إنشاء migrations لـ Supabase، RLS، backups، audit logs.
- إنشاء استيراد بيانات مجمعة من POS/ERP وملفات تحميص مع validation/quarantine.
- نقل سجل التشغيل من localStorage إلى DB، وإظهار تشغيلات التاريخ المشتركة.
- إضافة مؤشرات data freshness وفشل الاستيراد وعامل مراقبة الحالة.
- تعيين مسار /reality-lab كمنطقة داخلية محمية؛ عدم إتاحته كموقع تشغيل عام.

### P1 — الصدقية العلمية
- توصيل Python engine v0.2 بخدمة Worker وqueue.
- ربط دفعات التحميص، فقد الوزن، مصادر البن، التعبئة والتوزيع، والمبيعات على مستوى الفرع.
- بناء معايرة لكل متغير باستخدام قياسات مستقلة: أزمنة تحضير، التحميص، التأخر، دقة المخزون.
- split train/hold-out زمني مع مقاييس خطأ واضحة؛ نشر سجل حدود عدم اليقين.
- إضافة traceability من كل مقياس إلى المصدر ورقم إصدار النموذج.
- تشغيل سيناريوهات متعددة مع مؤشرات المقارنة وتكلفة القرار.

### P2 — المراقبة والتوسع
- تشغيل مجدول/عند تحديث البيانات، وتنبيهات تغيّر مؤشرات المخزون والخدمة.
- داشبورد تنفيذي / تشغيلي / بحثي حسب الصلاحيات.
- تصدير أوراق نتائج ودراسات موسوعية موثقة.
- إضافة نماذج التنبؤ، والتحليل السببي، والتحسين تحت القيود.

## تعريف النجاح
- كل تشغيل له ID دائم، إصدار نموذج، checksum للمدخلات، seed، توقيت ونوع مصدر البيانات.
- يستطيع الباحث إعادة إنتاج نتائج التشغيل من المدخلات والنسخة الأصلية.
- لا تظهر نتيجة واقعية قبل وجود مصدر بيانات حقيقي وvalidation مستقل.
- يُوسم كل رسم: بيانات حقيقية / معايرة جزئية / محاكاة افتراضية.
- يُقاس الفرق بين محاكاة الواقع والواقع ببيانات اختبار مستقلة قبل أي قرار تشغيلي.

## مهمات المحاكاة ذات الأولوية
1. الإمداد: زمن التحميص ← rest ← التعبئة ← dispatch ← استلام الفرع.
2. الخدمة: Poisson/empirical arrivals، أزمنة التحضير حسب SKU، المعدات المشتركة، توزع العمالة والضغط.
3. المخزون: batch+expiry+FEFO، reorder decisions، lost sales وservice level.
4. المالية: gross margin من تكاليف BOM الفعلية بدل القيم الافتراضية.
5. التحقق: عدم خلط الارتباط بالسببية، وعدم اعتبار تكرارات النموذج عدم يقين الواقع.
