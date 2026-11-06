# تصميم تطبيق إدارة توثيق المقالات داخل CMS

## كيانات بيانات

ArticleDocumentation: slug, article_url, content_revision, current_outline, proposed_outline, search_intent, editor, reviewer, audit_status, last_audit_at, report_path.

FactClaim: claim_id, article_slug, text, section_id, source_url, effective_at, checked_at, reviewer, confidence_status, action_required, proof_excerpt.

SEOInspection: slug, title, meta_description, canonical, robots, schema_types, status_code, redirect_chain, internal_links, image_alt, sitemap, CWV metrics, inspection_method, timestamp.

EditorialDecision: slug, issue_id, priority, task, evidence, acceptance_criteria, submitted_by, approved_by, decision, decision_at, before_after_diff.

## واجهة كل مقال

Overview — Information — Current Outline — Target Outline — On-Page — Technical SEO — Search Console — Editorial QA — Evidence — Change Log.

## التشغيل

- عندما يتغير المقال: حفظ snapshot، مقارنة العناوين والمراجع، وإنشاء مهام مراجعة بحسب خطورة الادعاء.
- أسبوعيًا: مراجعة مواعيد المصادر والروابط الرسمية المهمة، لا تغيير سنة العنوان فقط.
- قبل الاعتماد: إنسان مسؤول يراجع حقائق القانون أو المال أو الصحة؛ لا تعلن أن AI أكمل التحقق تلقائيًا.
- بعد النشر: اختبارات SEO الفنية عن رابط الإنتاج وحالة الفهرسة الحقيقية، مع تاريخ ونتيجة ولقطة أو URL دليل.
- كل صفحة منشورة لها وثيقة مرتبطة برابط ثابت وسجل نسخ دون مسح القرارات السابقة.

## تعريف اكتمال المهمة

المقال منشور وله ملف تدقيق، وتفاصيل fact-check المؤثرة موثقة بالمراجع، وتحقيق HTML وtechnical checks مسجل، وله موافقة تحريرية مع اسم وتاريخ.