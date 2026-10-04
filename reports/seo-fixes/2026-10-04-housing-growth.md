# SEO follow-up implementation — 4 October 2026

Base main: 7eb7d466ac7ac7873e06614903cfc6a8ce8dd3c0, matching the READY production deployment in Vercel project prj_GvzTCMz7VvyslHpXgfxjBUApCZnS. Changes extend the existing SEO pull request. Production is not updated by this report.

## Implemented

- Refreshed old-rent housing application guide with the 28 September official Ministry of Housing update, reviewed 4 October, preserving the original publication date. Added two real FAQs and a dated official-source reference. The announced deadline remains 12 October 2026; no new extension is asserted.
- Added a prominent homepage deadline box and links through the five-guide housing journey. The notice checks the published deadline at hourly homepage regeneration and switches to a request to consult the authority after it passes.
- Rewrote homepage meta description to 149 characters.
- Rewrote all 105 published article search titles with a service-first 2026/action pattern. Full rendered titles are 50–60 characters including the brand, except any intentionally shorter natural wording recorded by the crawl; no unsupported source-review dates were added. Full H1s and Article headlines remain descriptive.
- All 105 articles already had official sources and review dates. Added semantic time elements, a clearly labeled related-next-step block and links to the category hub/task path. Existing task-relevant related guides remain intact.
- Added substantive introductions to the two category hubs that lacked them; all five published categories now have introductions.
- Preserved Article, BreadcrumbList and Organization schema; FAQPage reflects visible FAQs only. Limited HowTo to six concrete digital procedures instead of all step-based articles. Schema.org markup does not imply a Google rich-result feature; Google removed FAQ rich results in May 2026 and HowTo was previously retired.
- Corrected the homepage typo «مبثرة» to «متناثرة» and updated the stale footer month.
- Fixed the search aria-controls reference, increased muted text/footer contrast, and added responsive article cover sizes.
- Changed the configured non-www redirect from 308 to 301, preserving path and query. Existing robots exclusions and canonical sitemap improvements from the initial PR are included.
- Added optional GA4 integration and .env.example. It is inactive until the real measurement ID is configured. It records pathname page views, strips query/fragment from page and referrer URLs, honors Do Not Track, and disables ad personalization/signals. README explains stream settings, ingestion verification and private baseline storage; privacy page describes the optional provider.

## Live technical checks and mobile baseline

Before these follow-up changes, robots.txt and sitemap.xml both returned 200. All 159 sitemap page loc elements used https://www.lusaill.online. HTTPS non-www redirected to www with 308; HTTP non-www first redirected to HTTPS with 308. Local regression checks verify the new HTTPS host redirect returns 301 with preserved path/query; live Vercel HTTP-to-HTTPS behavior is a separate platform setting.

PageSpeed mobile homepage: performance 99, LCP 1.8 seconds, FCP 0.9 seconds, CLS 0; accessibility 90 before the fixes. Report: https://pagespeed.web.dev/analysis/https-www-lusaill-online/izqnmubc2i?form_factor=mobile

PageSpeed mobile housing application article: performance 100, LCP 1.8 seconds, CLS 0; accessibility 96 before the fixes. Report: https://pagespeed.web.dev/analysis/https-www-lusaill-online-articles-old-rent-housing-apply/5j5uzjc1xw?form_factor=mobile

These are live-site lab measurements, not field data or Egyptian-user measurements. PageSpeed reports insufficient field data. The direct API attempt returned quota 429; the PageSpeed browser reports completed successfully.

## Dependencies still awaiting the owner

- Google Search Console domain property: available browser is signed out. Requires owner sign-in and the exact DNS TXT token at the authoritative DNS provider. No verification, sitemap submission, or request-indexing action has been claimed.
- Bing Webmaster Tools: available browser is signed out. Verification/import and sitemap/URL submission remain pending.
- The selected 20 URLs are a business-priority shortlist, led by housing; no Search Console traffic evidence was available. Successful requests and quotas must be recorded individually. Requests do not guarantee indexing.
- Facebook/WhatsApp: recipient/group destinations have not been provided. Prepared accurate Arabic sharing drafts; no posts or messages were sent.
- GA4: measurement ID/property is not supplied. Integration alone is not event ingestion and there is no GA4 baseline yet. Existing Vercel Analytics code does not prove a configured dashboard or incoming events.

## Sources

- Housing update: https://sis.gov.eg/ar/المركز-الإعلامي/الأخبار/وزيرة-الإسكان-تترأس-اجتماع-مجلس-إدارة-صندوق-الإسكان-الاجتماعي-ودعم-التمويل-العقاري-1/
- Google verification: https://support.google.com/webmasters/answer/9008080
- Google pageview measurement: https://developers.google.com/analytics/devguides/collection/ga4/views
- Google structured-data updates: https://developers.google.com/search/updates

## Final validation

Lint, SEO QA, SEO audit integration tests, TypeScript and optimized build passed. The final built HTTP crawl passed on 159 sitemap pages, 105 articles, 6 HowTo pages, 161 distinct internal link targets and 137 image URLs. External Wikimedia image fetching was excluded from the local crawl. All 105 rendered search titles are 50–60 characters including the brand. A boundary check verifies the deadline notice changes after 12 October ends in Egypt's +03:00 timezone.

Browser checks: mobile housing page has no horizontal overflow, the next-step block renders, the homepage search returns the five housing guides, and no error/warning logs appeared during the checked interactions. PageSpeed's missing aria-controls target was corrected. These checks do not substitute for the still-pending owner account actions or a live GA4 ingestion check.
