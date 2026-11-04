import Link from 'next/link';
import {housingPressUpdate as news} from '@/lib/housing-press-update';

export function HousingPressUpdate(){return <section id="housing-press-followup" className="brief-box callout callout-warning" aria-labelledby="housing-press-followup-title">
  <p>متابعة صحفية — آخر مراجعة لهذه المتابعة: <time dateTime={news.checkedAt}>1 نوفمبر 2026</time></p>
  <h2 id="housing-press-followup-title">تقارير عن تمديد السكن البديل إلى يناير 2027: ما الذي تأكد؟</h2>
  <p>{news.answer}</p>
  <p>اختلاف 12 و13 يناير ظهر في عنوان ومتن إحدى التغطيات؛ لا يُحسم بالاختيار بينهما. كما أن خبرًا صحفيًا منسوبًا لمسؤول أو لمجلس الوزراء لا يغني هنا عن الاطلاع على نص الإعلان الرسمي وإتاحة الخدمة الحالية.</p>
  <p>خبر المد الصحفي لا يعني قبول طلب بعينه أو تخصيص وحدة. ولا تخلط بين طلب الوحدات البديلة لمستأجري الإيجار القديم وحجز وحدات «سكن لكل المصريين 9»؛ لكل مسار شروطه وإعلانه.</p>
  <h3>مصادر التغطية الصحفية — ليست بديلًا للبيان الرسمي</h3>
  <ul>{news.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
  <p>للتحقق من الإجراء الحالي: <a href="https://shmff.gov.eg/" target="_blank" rel="noopener noreferrer">صندوق الإسكان الاجتماعي</a> · <a href="https://digital.gov.eg/" target="_blank" rel="noopener noreferrer">مصر الرقمية</a>. لم نؤكد من هذين الرابطين موعد يناير أو نجاح تقديم طلب جديد.</p>
  <p>إن كنت قد قدمت طلبًا، احتفظ برقمه وتابع إخطاراته من حسابك: <Link href="/articles/old-rent-housing-track">دليل متابعة الطلب والنواقص</Link>.</p>
</section>;}
