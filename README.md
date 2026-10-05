# لوسيل — lusaill.online

موقع محتوى عربي يستهدف السوق المصري (Google.com.eg) بأدلة عملية للخدمات الحكومية والمرافق:
فواتير الكهرباء، بوابة مصر الرقمية، رخص القيادة، حماية المستهلك، المحافظ الإلكترونية، عقود
الإيجار، وشهادة الميلاد والسجل المدني.

هذا المستودع سقالة (scaffold): كل الأنابيب التقنية جاهزة (توجيه، سكيمة، خرائط الموقع، قوالب
تحرير)، لكن **المحتوى الفعلي غير مكتوب عمدًا** — الرسوم وأرقام الهواتف وخطوات البوابات يجب أن
تأتي من شخص فتح المصدر الرسمي فعليًا، لا من نموذج لغوي.

## البنية

- [`lib/clusters.ts`](lib/clusters.ts) — العناقيد السبعة (A–G) من خطة الكلمات المفتاحية.
- [`lib/articles-data.ts`](lib/articles-data.ts) — الـ 107 صفًا المنقولة حرفيًا من الخطة (100
  مقال أساسي + 7 إضافية لعنقود G في الشهر السادس)، مع الكلمة المستهدفة والحجم والصعوبة (KD)
  والشهر المستهدف.
- [`lib/content.ts`](lib/content.ts) — يشتق الروابط (slugs) من الكلمات المفتاحية، ويضيف حقول
  التحرير الفارغة لكل مقال (`quickAnswer`, `summaryTable`, `steps`, `commonMistakes`, `sources`,
  `faqs`) بانتظار الكتابة.
- `app/articles/[slug]` — صفحة "ملف تحرير" لكل مقال: تعرض القالب الفائز فارغًا إن لم تُكتب
  الحقول بعد، وتتحول تلقائيًا لصفحة منشورة كاملة بمجرد تعبئتها.

## كيف تنشر مقالاً

1. افتح [`lib/articles-data.ts`](lib/articles-data.ts) وجِد المقال بالـ `id`.
2. في [`lib/content.ts`](lib/content.ts) لا تُعدّل شيئًا — بدلاً من ذلك أضف بيانات المقال
   (`quickAnswer`, `summaryTable`, `steps`, `commonMistakes`, `sources`, `faqs`) في مصدر بيانات
   تحريري منفصل (مثلاً `lib/article-content/<slug>.ts`) ثم ادمجه في دالة `articles` — هذا يفصل
   خطة الكلمات المفتاحية (لا تتغير) عن المحتوى الفعلي (يُكتب تدريجيًا).
3. غيّر `status` إلى `"published"` بعد التحقق من كل رقم ورابط من المصدر الرسمي وإضافة تاريخ
   المراجعة في `sources`.
4. مقال بحالة غير `"published"` لا يظهر في `sitemap.ts` ويحمل `robots: noindex` تلقائيًا — لا خطر
   من أرشفة محتوى غير مكتمل.

## أوامر التطوير

```bash
npm install
npm run dev
npm run build
npm run lint
```

## المصدر

خطة الكلمات المفتاحية الأصلية: OpenSEO / DataForSEO، أغسطس ٢٠٢٦. راجع [`app/editorial-policy`](app/editorial-policy/page.tsx)
لمعايير الدقة والمراجعة الربع سنوية.
## GA4 activation and baseline

The optional GA4 integration in `components/google-analytics.tsx` activates only when `NEXT_PUBLIC_GA4_MEASUREMENT_ID` contains the real `G-...` measurement ID from a GA4 web data stream. Add it to the existing Vercel project's production and preview environments, then rebuild/redeploy. `.env.example` documents the variable without a live identifier.

Disable automatic enhanced-measurement page views and history-change page views in the web stream so the App Router's manually sent events are not duplicated. Disable form/search measurement; those user inputs should not be collected. The integration sends one initial page view and subsequent pathname navigation views, excludes query strings and fragments from page/referrer URLs, respects Do Not Track, and disables Google signals and ad personalization.

Activation is not proof of ingestion. Verify a permitted visit in GA4 Realtime/DebugView, then record seven days of page views, acquisition source/medium, device category and page paths as the first baseline. Keep baseline exports in ignored `performance-data/`; do not publish private analytics reports in GitHub. Campaign attribution and collection depend on the actual stream settings and must be checked in the live property.

## Webmaster setup

Create or open the **domain property** `lusaill.online` in Google Search Console. Use its exact DNS TXT verification token at the authoritative DNS provider; the homepage verification tag does not verify a domain property. Confirm verification, submit `https://www.lusaill.online/sitemap.xml`, and inspect the prioritized URLs individually. Google's request-indexing quota may prevent all 20 requests in one session; record successful requests rather than assuming indexing.

In Bing Webmaster Tools, verify/import the same site with the authorized account, submit the canonical sitemap and the prioritized URLs. Existing IndexNow configuration is separate from account verification and is not proof of indexing.
