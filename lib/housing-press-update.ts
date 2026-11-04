import type { Article } from './content';

export const housingPressUpdate = {
  checkedAt: '2026-11-01',
  updatedAt: '2026-11-01T10:45:38+03:00',
  title: 'السكن البديل: متابعة خبر مد التقديم إلى يناير 2027',
  description: 'متابعة أخبار السكن البديل للإيجار القديم وتقارير مد التقديم إلى يناير 2027، مع توضيح تعارض التغطيات وما لم يتأكد رسميًا وروابط التحقق ومتابعة الطلب.',
  answer: 'نشرت صحف بتاريخ 28 أكتوبر 2026 تقارير تنسب إلى مجلس الوزراء مد تقديم طلبات السكن البديل حتى 12 يناير 2027. لم نتمكن حتى مراجعة 1 نوفمبر من الحصول على البيان الرسمي لتأكيد الموعد، وتوجد تغطية أخرى في اليوم نفسه تقول إن التقديم أُغلق. لذلك لا نقدّم 12 أو 13 يناير باعتباره موعدًا رسميًا مؤكدًا؛ تحقق من صندوق الإسكان ومن خدمة السكن البديل في مصر الرقمية قبل بدء إجراء جديد.',
  sources: [
    { label: 'الوطن — تقرير مد المهلة، 28 أكتوبر 2026، الساعة 14:41', url: 'https://www.elwatannews.com/news/details/8385968' },
    { label: 'مصراوي — تقرير المد إلى 12 يناير، 28 أكتوبر 2026، الساعة 15:12', url: 'https://www.masrawy.com/news/news_egypt/details/2026/10/28/3069988/-الإيجار-القديم-قرار-عاجل-من-الحكومة-بشأن-وحدات-السكن-البديل' },
    { label: 'الشروق — تغطية متعارضة عن إغلاق التقديم، 28 أكتوبر 2026، الساعة 13:00', url: 'https://www.shorouknews.com/news/view.aspx?cdate=28102026&id=058440aa-ddca-4507-99cb-4dc85cf4a3d6' },
    { label: 'المال — اختلاف بين عنوان 13 يناير ومتن يذكر 12 يناير، 28 أكتوبر 2026', url: 'https://almalnews.com/2143974/مجلس-الوزراء-مد-فترة-التقديم-على-وحدات/' },
  ],
};

export function applyHousingPressUpdate(article: Article): Article {
  if (!article.slug.startsWith('old-rent-housing-')) return article;
  const updated = {
    ...article,
    updatedAt: housingPressUpdate.updatedAt,
    summaryTable: article.summaryTable?.map(row => row.value.includes('12 أكتوبر 2026') && /موعد|تحديث/.test(row.label)
      ? { ...row, label: row.label.includes('تحديث') ? 'المصدر الرسمي السابق' : 'الموعد في المصدر السابق', value: `سياق المصدر السابق: ${row.value} توجد تغطيات صحفية أحدث موضحة في تحديث المتابعة أعلاه، ولم نؤكد موعدًا رسميًا جديدًا.` }
      : row),
    faqs: article.faqs?.map(faq => faq.answer.includes('12 أكتوبر 2026')
      ? { ...faq, answer: '12 أكتوبر 2026 هو الموعد الوارد في المصدر الرسمي السابق لهذا الدليل. ظهرت تغطيات صحفية أحدث عن يناير 2027 موضحة في تحديث المتابعة، لكن لم تتوفر لنا نسخة البيان الرسمي لتأكيد الموعد الجديد. تحقق من صندوق الإسكان ومصر الرقمية قبل الاعتماد على موعد للتقديم.' }
      : faq),
  };
  if (article.slug !== 'old-rent-housing-apply') return updated;
  return { ...updated, title: housingPressUpdate.title, metaDescription: housingPressUpdate.description, quickAnswer: housingPressUpdate.answer,
    faqs: [...(updated.faqs ?? []), { question: 'هل تأكد تمديد تقديم السكن البديل إلى يناير 2027؟', answer: housingPressUpdate.answer }],
  };
}

