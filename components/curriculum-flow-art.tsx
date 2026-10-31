const flows:Record<string,{title:string;nodes:string[];detail:string;code?:string}>={
 'excel-analysis':{title:'خط تحليل Excel من البيانات إلى المراجعة',nodes:['مصدر','نموذج','تقرير'],detail:'أنواع صحيحة · علاقات واضحة · تحديث موثّق',code:'10 + 20 + 30 = 60'},
 'agile-flow':{title:'دورة عمل رشيقة من الفرضية إلى التعلم',nodes:['هدف','جزء عامل','تعلّم'],detail:'قيمة صغيرة · ملاحظة · قرار تالٍ'},
 'data-flow':{title:'مسار تجربة البيانات من السؤال إلى التقييم',nodes:['سؤال','تجربة','دليل'],detail:'خط أساس · تقسيم مستقل · مراجعة'},
 'testing-flow':{title:'ربط مخاطر المنتج بالأمثلة ودليل الاختبار',nodes:['خطر','فحص','دليل'],detail:'سلوك متوقع · نتيجة فعلية · قرار تسليم'},
 'agri-flow':{title:'ربط القياس الزراعي بالقرار والمراجعة',nodes:['حساس','تحقّق','قرار'],detail:'جودة القياس قبل ادعاء الأثر'},
 'ai-flow':{title:'نظام ذكاء اصطناعي له مدخل وتوقع وتقييم',nodes:['مدخل','نموذج','تقييم'],detail:'القدرة في مهمة لا تعني صحة كل جواب'},
 'engineering-flow':{title:'مسار هندسة خدمة ذكاء اصطناعي',nodes:['عقد','خدمة','مراقبة'],detail:'بيانات · إصدار · خطة رجوع'},
 'python-flow':{title:'مسار تجربة تعلم باستخدام Python',nodes:['بيانات','تعلّم','تحقّق'],detail:'تمثيل واضح · تدريب · اختبار مستقل',code:'X → model → y'},
 'aiml-flow':{title:'مطابقة قواعد المحادثة في AIML',nodes:['عبارة','نمط','رد'],detail:'قواعد XML · سياق · رد احتياطي',code:'<pattern> → <template>'},
 'ajax-flow':{title:'رحلة طلب ويب واستجابة وتحديث الواجهة',nodes:['واجهة','خادم','تحديث'],detail:'تحميل · نجاح · فشل · إلغاء',code:'request → response'},
 'algorithm-flow':{title:'عقد الخوارزمية من المدخل إلى الناتج',nodes:['مدخل','خطوات','ناتج'],detail:'صحة · حدود · زمن ومساحة',code:'[3, 1, 4] → max → 4'},
 'code-flow':{title:'مراجعة اقتراح الشيفرة قبل اعتماده',nodes:['سياق','اقتراح','مراجعة'],detail:'متطلب · فحص · صلاحيات وترخيص'},
 'market-flow':{title:'تقييم تشغيل عرض في سوق إلكترونية',nodes:['عرض','تنفيذ','مراجعة'],detail:'تكلفة فعلية · مخزون · خدمة عميل'}
};
export function CurriculumFlowArt({kind,decorative=false}:{kind:string;decorative?:boolean}){const f=flows[kind];if(!f)return null;return <svg className="academy-original-diagram curriculum-flow-art" viewBox="0 0 560 350" role={decorative?undefined:'img'} aria-label={decorative?undefined:f.title} aria-hidden={decorative?true:undefined}><rect width="560" height="350" rx="25" fill="var(--course-wash,#eef5f7)"/><circle cx="490" cy="40" r="100" fill="var(--course-soft,#d5e9eb)"/><path d="M130 155H430" stroke="var(--course-ink,#245a62)" strokeWidth="3" strokeDasharray="6 6"/>{f.nodes.map((t,i)=><g key={t}><rect x={380-i*165} y="100" width="130" height="110" rx="18" fill="white"/><circle cx={445-i*165} cy="110" r="15" fill="var(--course-ink,#245a62)"/><text x={445-i*165} y="111" className="curriculum-flow-number">{i+1}</text><text x={445-i*165} y="165">{t}</text></g>)}<text x="280" y="265">{f.detail}</text>{f.code&&<text x="280" y="310" direction="ltr" className="curriculum-flow-code">{f.code}</text>}</svg>;}
export const curriculumArtKinds=Object.keys(flows);
